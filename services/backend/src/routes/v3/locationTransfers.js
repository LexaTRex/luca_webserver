/* eslint-disable max-lines */
const router = require('express').Router();
const moment = require('moment');
const config = require('config');
const status = require('http-status');
const { Op } = require('sequelize');

const database = require('../../database');
const {
  sendShareDataRequestNotification,
  locationTransferApprovalNotification,
} = require('../../utils/mailClient');
const {
  validateSchema,
  validateParametersSchema,
  validateQuerySchema,
} = require('../../middlewares/validateSchema');
const { requireOperator } = require('../../middlewares/requireUser');

const {
  requireHealthDepartmentEmployee,
} = require('../../middlewares/requireUser');
const logger = require('../../utils/logger');
const { formatLocationName } = require('../../utils/format');

const {
  createSchema,
  getSchema,
  sendSchema,
  transferIdParametersSchema,
} = require('./locationTransfers.schemas');

const mapTraceEncryptedData = trace => ({
  isHDEncrypted: trace.isHDEncrypted,
  data: trace.isHDEncrypted
    ? {
        data: trace.data,
        publicKey: trace.dataPublicKey,
        iv: trace.dataIV,
        mac: trace.dataMAC,
      }
    : trace.data,
});

/**
 * Create a transfer request for venues traced by an infected guest. Preceded
 * by a user transfer of check-in history, this will check for venues an
 * infected guest has checked-in to in order to determine potential contact persons
 * @see https://www.luca-app.de/securityoverview/processes/tracing_find_contacts.html#process
 * @see https://www.luca-app.de/securityoverview/processes/tracing_access_to_history.html
 */
router.post(
  '/',
  requireHealthDepartmentEmployee,
  validateSchema(createSchema),
  async (request, response) => {
    const transaction = await database.transaction();
    const maxLocations = config.get('luca.locationTransfers.maxLocations');
    if (request.body.locations.length > maxLocations)
      return response.sendStatus(status.REQUEST_ENTITY_TOO_LARGE);

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

      await Promise.all(
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

      await transaction.commit();

      return response.send({ tracingProcessId: tracingProcess.uuid });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
);

/**
 * Get all location transfers of the currently logged-in operator.
 */
router.get(
  '/',
  requireOperator,
  validateQuerySchema(getSchema),
  async (request, response) => {
    const { completed, deleted } = request.query;

    const operatorId = request.user.uuid;

    const whereClause = {
      contactedAt: {
        [Op.ne]: null,
      },
    };

    if (completed === 'true') {
      whereClause.isCompleted = true;
    } else if (completed === 'false') {
      whereClause.isCompleted = false;
    }

    if (deleted === 'true') {
      whereClause.deletedAt = { [Op.ne]: null };
    } else if (completed === 'false') {
      whereClause.deletedAt = null;
    }

    const transfers = await database.LocationTransfer.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
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
        deletedAt: transfer.deletedAt && moment(transfer.deletedAt).unix(),
      }))
    );
  }
);

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
        ...mapTraceEncryptedData(trace),
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
      deletedAt: moment(transfer.deletedAt).unix(),
    }))
  );
});

/**
 * Get a single location transfer by ID, containing issuing health department,
 * involved locations and associated traces
 */
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
        signedPublicHDEKP: department.signedPublicHDEKP,
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
        ...mapTraceEncryptedData(trace),
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
      deletedAt: moment(transfer.deletedAt).unix(),
    });
  }
);

/**
 * Send an email to the venue of the given location transfer request. The venue
 * has to specifically assist in the tracing process by removing the venue's
 * layer of encryption of contact data references
 * @see https://www.luca-app.de/securityoverview/processes/tracing_access_to_history.html
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-contact-data-reference
 */
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
        null,
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

/**
 * Fetch transferred traces of a given location transfer after the request has been fulfilled by a venue, meaning
 * the venue has provided encrypted contact data references without the venue's layer of encryption
 * @see https://www.luca-app.de/securityoverview/processes/tracing_access_to_history.html
 */
router.get(
  '/:transferId/traces',
  requireHealthDepartmentEmployee,
  validateParametersSchema(transferIdParametersSchema),
  async (request, response) => {
    const transfer = await database.LocationTransfer.findOne({
      where: {
        uuid: request.params.transferId,
        departmentId: request.user.departmentId,
        isCompleted: true,
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
        ...mapTraceEncryptedData(trace),
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

/**
 * Express middleware to validate a transferId before potentially accepting
 * large JSON payloads
 */
const validateTransferId = async (request, response, next) => {
  const transfer = await database.LocationTransfer.findByPk(
    request.params.transferId,
    {
      include: [
        {
          required: true,
          model: database.Location,
          attributes: ['name'],
          include: [
            {
              model: database.LocationGroup,
              attributes: ['name'],
              paranoid: false,
            },
            {
              model: database.Operator,
              attributes: ['email', 'firstName', 'lastName'],
              paranoid: false,
            },
          ],
          paranoid: false,
        },
        {
          model: database.HealthDepartment,
          attributes: ['name'],
        },
      ],
    }
  );

  if (!transfer) {
    return response.sendStatus(status.NOT_FOUND);
  }

  request.transfer = transfer;
  return next();
};

/**
 * Upload trace data associated with the given transfer request. This is done by a venue fulfilling the location transfer
 * request by a health department. The venue will remove its layer of encryption of the contact data references and upload
 * the resulting data to the luca server. Health departments still need to decrypt the references using their private key.
 * @see https://www.luca-app.de/securityoverview/processes/tracing_access_to_history.html
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-contact-data-reference
 */
router.post(
  '/:transferId',
  validateParametersSchema(transferIdParametersSchema),
  validateTransferId,
  validateSchema(sendSchema, '20mb'),
  async (request, response) => {
    const { transfer, body } = request;
    const { traces } = body;

    const transferTraces = await database.LocationTransferTrace.findAll({
      where: {
        locationTransferId: transfer.uuid,
      },
    });

    const requestTracesById = new Map(
      traces.map(trace => [trace.traceId, trace])
    );
    const locationTransferTraceIds = new Set(
      transferTraces.map(trace => trace.traceId)
    );
    // reject request if invalid trace IDs are contained
    if (!traces.every(trace => locationTransferTraceIds.has(trace.traceId))) {
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
          isHDEncrypted: requestTraceData.isHDEncrypted,
          publicKey: requestTraceData.publicKey,
          verification: requestTraceData.verification,
          keyId: requestTraceData.keyId,
          version: requestTraceData.version,
          deviceType: requestTraceData.deviceType,
        };

        if (requestTraceData.isHDEncrypted && requestTraceData.data) {
          transferTracePayload.data = requestTraceData.data.data;
          transferTracePayload.dataPublicKey = requestTraceData.data.publicKey;
          transferTracePayload.dataIV = requestTraceData.data.iv;
          transferTracePayload.dataMAC = requestTraceData.data.mac;
        } else {
          transferTracePayload.data = requestTraceData.data;
        }
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

    try {
      const dateFormat = 'DD.MM.YYYY HH:mm';
      locationTransferApprovalNotification(
        transfer.Location.Operator.email,
        `${transfer.Location.Operator.firstName} ${transfer.Location.Operator.lastName}`,
        null,
        {
          id: transfer.uuid,
          createdAt: moment(transfer.createdAt).format(dateFormat),
          updatedAt: moment(transfer.updatedAt).format(dateFormat),
          departmentName: transfer.HealthDepartment.name,
          timeFrameFrom: moment(transfer.time[0].value).format(dateFormat),
          timeFrameTo: moment(transfer.time[1].value).format(dateFormat),
          locationName:
            transfer.Location.name || transfer.Location.LocationGroup.name,
        }
      );
      await transfer.update({
        isCompleted: true,
      });
    } catch (error) {
      logger.error({ message: 'failed to send email', error });
    }
    return response.sendStatus(status.NO_CONTENT);
  }
);

module.exports = router;
