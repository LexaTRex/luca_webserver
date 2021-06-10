/* eslint-disable max-lines */
const router = require('express').Router();
const moment = require('moment');
const config = require('config');
const status = require('http-status');
const { Op } = require('sequelize');

const database = require('../../database');
const { z } = require('../../middlewares/validateSchema');
const { sendShareDataRequestNotification } = require('../../utils/mailjet');
const {
  validateSchema,
  validateParametersSchema,
} = require('../../middlewares/validateSchema');
const { requireOperator } = require('../../middlewares/requireUser');

const {
  requireHealthDepartmentEmployee,
} = require('../../middlewares/requireUser');
const logger = require('../../utils/logger');
const { formatLocationName } = require('../../utils/format');

const { createSchema, sendSchema } = require('./locationTransfers.schemas');

// HD create transfer
router.post(
  '/',
  requireHealthDepartmentEmployee,
  validateSchema(createSchema),
  async (request, response) => {
    const transaction = await database.transaction();

    try {
      const tracingProcess = await database.TracingProcess.create(
        {
          departmentId: request.user.departmentId,
          userTransferId: request.body.userTransferId,
        },
        { transaction }
      );

      if (request.body.userTransferId) {
        const userTransfer = await database.UserTransfer.findByPk(
          request.body.userTransferId,
          { transaction }
        );

        if (!userTransfer) {
          await transaction.rollback();
          return response.sendStatus(status.NOT_FOUND);
        }

        await userTransfer.update(
          {
            departmentId: request.user.departmentId,
            tan: null,
          },
          { transaction }
        );
      }

      const locationTransfers = await Promise.all(
        request.body.locations.map(async locationRequest => {
          const location = await database.Location.findByPk(
            locationRequest.locationId,
            {
              include: {
                required: true,
                model: database.Operator,
                paranoid: false,
              },
              paranoid: false,
            }
          );

          if (!locationRequest || !location) {
            logger.error({
              message: 'Missing location for location transfer',
              locations: request.body.locations,
            });
            return null;
          }

          const locationTransfer = await database.LocationTransfer.create(
            {
              departmentId: request.user.departmentId,
              tracingProcessId: tracingProcess.uuid,
              locationId: location.uuid,
              time: [
                moment.unix(locationRequest.time[0]),
                moment.unix(locationRequest.time[1]),
              ],
            },
            { transaction }
          );

          const traces = await database.Trace.findAll({
            where: {
              locationId: location.uuid,
              time: {
                [Op.overlap]: [
                  moment.unix(locationRequest.time[0]),
                  moment.unix(locationRequest.time[1]),
                ],
              },
            },
          });

          await database.LocationTransferTrace.bulkCreate(
            traces.map(trace => ({
              locationTransferId: locationTransfer.uuid,
              traceId: trace.traceId,
              time: trace.time,
              deviceType: trace.deviceType,
            })),
            { transaction }
          );

          return { location, locationTransfer };
        })
      );

      const locationGroups = {};

      await Promise.all(
        locationTransfers
          .filter(transfer => transfer)
          .map(async ({ location, locationTransfer }) => {
            if (!locationGroups[location.operator]) {
              const group = database.LocationTransferGroup.create(
                {
                  tracingProcessId: tracingProcess.uuid,
                },
                { transaction }
              );

              locationGroups[location.operator] = {
                group,
                operator: location.Operator,
              };
            }
            const group = await locationGroups[location.operator].group;
            await group.addLocationTransfer(locationTransfer, { transaction });
            locationGroups[location.operator].group = group;
          })
      );

      await transaction.commit();

      return response.send({ tracingProcessId: tracingProcess.uuid });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
);

// get all transfers the logged in operator
router.get('/', requireOperator, async (request, response) => {
  const operatorId = request.user.uuid;

  const transfers = await database.LocationTransfer.findAll({
    where: {
      contactedAt: {
        [Op.ne]: null,
      },
    },
    include: [
      {
        required: true,
        model: database.Location,
        attributes: ['name'],
        include: {
          model: database.LocationGroup,
          attributes: ['name'],
          paranoid: false,
        },
        where: {
          operator: operatorId,
        },
        paranoid: false,
      },
      {
        model: database.HealthDepartment,
        attributes: ['name'],
      },
    ],
  });

  return response.send(
    transfers.map(transfer => ({
      uuid: transfer.uuid,
      groupName: transfer.Location.LocationGroup.name,
      locationName: transfer.Location.name,
      name: formatLocationName(
        transfer.Location,
        transfer.Location.LocationGroup
      ),

      departmentName: transfer.HealthDepartment.name,
      time: [
        moment(transfer.time[0].value).unix(),
        moment(transfer.time[1].value).unix(),
      ],
      isCompleted: transfer.isCompleted,
      contactedAt: transfer.contactedAt,
      createdAt: moment(transfer.createdAt).unix(),
    }))
  );
});

router.get('/uncompleted', requireOperator, async (request, response) => {
  const operatorId = request.user.uuid;
  const transfers = await database.LocationTransfer.findAll({
    where: {
      isCompleted: false,
      contactedAt: {
        [Op.ne]: null,
      },
    },
    include: [
      {
        model: database.LocationTransferTrace,
        attributes: ['traceId'],
        required: false,
        include: {
          required: true,
          model: database.Trace,
          include: {
            model: database.TraceData,
          },
        },
      },
      {
        required: true,
        model: database.Location,
        attributes: ['name', 'groupId', 'operator', 'publicKey'],
        include: {
          attributes: ['uuid', 'name'],
          model: database.LocationGroup,
          paranoid: false,
        },
        where: {
          operator: operatorId,
        },
        paranoid: false,
      },
      {
        required: true,
        model: database.HealthDepartment,
        attributes: ['uuid', 'name', 'publicHDEKP'],
      },
    ],
  });

  response.send(
    transfers.map(transfer => ({
      transferId: transfer.uuid,
      department: {
        uuid: transfer.HealthDepartment.uuid,
        name: transfer.HealthDepartment.name,
        publicHDEKP: transfer.HealthDepartment.publicHDEKP,
      },
      location: {
        groupId: transfer.Location.LocationGroup.uuid,
        groupName: transfer.Location.LocationGroup.name,
        locationName: transfer.Location.name,
        name: formatLocationName(
          transfer.Location,
          transfer.Location.LocationGroup
        ),
        publicKey: transfer.Location.publicKey,
      },
      time: [
        moment(transfer.time[0].value).unix(),
        moment(transfer.time[1].value).unix(),
      ],
      traces: transfer.LocationTransferTraces.filter(
        ({ Trace: trace }) => trace !== null
      ).map(({ Trace: trace }) => ({
        traceId: trace.traceId,
        time: [
          moment(trace.time[0].value).unix(),
          moment(trace.time[1].value).unix(),
        ],
        data: trace.data,
        publicKey: trace.publicKey,
        iv: trace.iv,
        mac: trace.mac,
        additionalData: trace.TraceDatum
          ? {
              data: trace.TraceDatum.data,
              publicKey: trace.TraceDatum.publicKey,
              mac: trace.TraceDatum.mac,
              iv: trace.TraceDatum.iv,
            }
          : null,
      })),
    }))
  );
});

const transferIdParametersSchema = z.object({
  transferId: z.string().uuid(),
});

// get a single transfer
router.get(
  '/:transferId',
  validateParametersSchema(transferIdParametersSchema),
  async (request, response) => {
    const transfer = await database.LocationTransfer.findByPk(
      request.params.transferId
    );
    if (!transfer) {
      return response.sendStatus(status.NOT_FOUND);
    }

    if (transfer.isCompleted) {
      return response.sendStatus(status.GONE);
    }

    const department = await database.HealthDepartment.findByPk(
      transfer.departmentId
    );

    if (!department) {
      return response.sendStatus(status.NOT_FOUND);
    }

    const location = await database.Location.findByPk(transfer.locationId, {
      include: {
        model: database.LocationGroup,
        attributes: ['uuid', 'name'],
        paranoid: false,
      },
      paranoid: false,
    });

    const transferTraces = await database.LocationTransferTrace.findAll({
      where: {
        locationTransferId: transfer.uuid,
      },
    });

    const traces = await database.Trace.findAll({
      where: {
        traceId: transferTraces.map(trace => trace.traceId),
      },
      include: {
        model: database.TraceData,
      },
    });

    return response.send({
      transferId: transfer.uuid,
      department: {
        uuid: department.uuid,
        name: department.name,
        publicHDEKP: department.publicHDEKP,
      },
      location: {
        groupId: location.LocationGroup.uuid,
        groupName: location.LocationGroup.name,
        locationName: location.name,
        name: formatLocationName(location, location.LocationGroup),
        publicKey: location.publicKey,
      },
      time: [
        moment(transfer.time[0].value).unix(),
        moment(transfer.time[1].value).unix(),
      ],
      // eslint-disable-next-line sonarjs/no-identical-functions
      traces: traces.map(trace => ({
        traceId: trace.traceId,
        time: [
          moment(trace.time[0].value).unix(),
          moment(trace.time[1].value).unix(),
        ],
        data: trace.data,
        publicKey: trace.publicKey,
        iv: trace.iv,
        mac: trace.mac,
        additionalData: trace.TraceDatum
          ? {
              data: trace.TraceDatum.data,
              publicKey: trace.TraceDatum.publicKey,
              mac: trace.TraceDatum.mac,
              iv: trace.TraceDatum.iv,
            }
          : null,
      })),
    });
  }
);

// HD request transfer
router.post(
  '/:transferId/contact',
  requireHealthDepartmentEmployee,
  validateParametersSchema(transferIdParametersSchema),
  async (request, response) => {
    const transfer = await database.LocationTransfer.findOne({
      where: {
        uuid: request.params.transferId,
      },
      include: [
        {
          required: true,
          model: database.HealthDepartment,
          attributes: ['name'],
          where: {
            uuid: request.user.departmentId,
          },
        },
        {
          required: true,
          model: database.Location,
          include: {
            model: database.Operator,
            attributes: ['uuid', 'email', 'lastName', 'firstName'],
            paranoid: false,
          },
          paranoid: false,
        },
      ],
    });

    if (!transfer) {
      return response.sendStatus(status.NOT_FOUND);
    }

    if (transfer.isCompleted) {
      return response.sendStatus(status.GONE);
    }

    try {
      sendShareDataRequestNotification(
        transfer.Location.Operator.email,
        `${transfer.Location.Operator.firstName} ${transfer.Location.Operator.lastName}`,
        'de',
        {
          firstName: transfer.Location.Operator.firstName,
          departmentName: transfer.HealthDepartment.name,
          transferUrl: `https://${config.get('hostname')}/shareData/${
            transfer.uuid
          }`,
        }
      );
      transfer.update({ contactedAt: moment() });
    } catch (error) {
      logger.error({ message: 'failed to send email', error });
    }
    return response.sendStatus(status.NO_CONTENT);
  }
);

// HD get trasnferred traces
router.get(
  '/:transferId/traces',
  requireHealthDepartmentEmployee,
  validateParametersSchema(transferIdParametersSchema),
  async (request, response) => {
    const transfer = await database.LocationTransfer.findOne({
      where: {
        uuid: request.params.transferId,
        departmentId: request.user.departmentId,
      },
    });
    if (!transfer) {
      return response.sendStatus(status.NOT_FOUND);
    }

    const traces = await database.LocationTransferTrace.findAll({
      where: {
        locationTransferId: request.params.transferId,
      },
    });

    return response.send({
      traces: traces.map(trace => ({
        traceId: trace.traceId,
        checkin: moment(trace.time[0].value).unix(),
        checkout: moment(trace.time[1].value).unix(),
        data: trace.data,
        publicKey: trace.publicKey,
        keyId: trace.keyId,
        version: trace.version,
        verification: trace.verification,
        deviceType: trace.deviceType,
        additionalData: trace.additionalData
          ? {
              data: trace.additionalData,
              iv: trace.additionalDataIV,
              mac: trace.additionalDataMAC,
              publicKey: trace.additionalDataPublicKey,
            }
          : null,
      })),
    });
  }
);

// transfer traces
router.post(
  '/:transferId',
  validateParametersSchema(transferIdParametersSchema),
  validateSchema(sendSchema),
  async (request, response) => {
    const transfer = await database.LocationTransfer.findByPk(
      request.params.transferId
    );

    if (!transfer) {
      return response.sendStatus(status.NOT_FOUND);
    }

    const transferTraces = await database.LocationTransferTrace.findAll({
      where: {
        locationTransferId: transfer.uuid,
      },
    });

    const requestTracesById = new Map(
      request.body.traces.map(trace => [trace.traceId, trace])
    );
    const locationTransferTraceIds = new Set(
      transferTraces.map(trace => trace.traceId)
    );
    // reject request if invalid trace IDs are contained
    if (
      !request.body.traces.every(trace =>
        locationTransferTraceIds.has(trace.traceId)
      )
    ) {
      return response.sendStatus(status.BAD_REQUEST);
    }

    const updatePromises = transferTraces
      .map(transferTrace => {
        const requestTraceData = requestTracesById.get(transferTrace.traceId);

        // skip traces that weren't contained in the request
        if (!requestTraceData) {
          return null;
        }

        const transferTracePayload = {
          data: requestTraceData.data,
          publicKey: requestTraceData.publicKey,
          verification: requestTraceData.verification,
          keyId: requestTraceData.keyId,
          version: requestTraceData.version,
          deviceType: requestTraceData.deviceType,
        };

        if (requestTraceData.additionalData) {
          transferTracePayload.additionalData =
            requestTraceData.additionalData.data;
          transferTracePayload.additionalDataPublicKey =
            requestTraceData.additionalData.publicKey;
          transferTracePayload.additionalDataIV =
            requestTraceData.additionalData.iv;
          transferTracePayload.additionalDataMAC =
            requestTraceData.additionalData.mac;
        }

        return transferTrace.update(transferTracePayload);
      })
      .filter(updateTransfer => updateTransfer !== null);

    await Promise.all(updatePromises);
    await transfer.update({
      isCompleted: true,
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

module.exports = router;
