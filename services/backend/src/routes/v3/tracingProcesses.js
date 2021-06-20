const router = require('express').Router();
const status = require('http-status');
const moment = require('moment');
const { pick } = require('lodash');

const {
  validateSchema,
  validateParametersSchema,
} = require('../../middlewares/validateSchema');

const database = require('../../database');

const {
  requireHealthDepartmentEmployee,
} = require('../../middlewares/requireUser');

const {
  tracingProcessIdParametersSchema,
  patchSchema,
} = require('./tracingProcesses.schemas');

const TRACE_PROCESS_STATUS_TYPES = {
  NONE: 0,
  PARTIAL: 1,
  ALL: 2,
  REQUESTED: 3,
  REQUEST_PARTIAL: 4,
};

function getTraceProcessStatus(tracingProcess) {
  const locations = tracingProcess.LocationTransfers;
  const numberOfCompletedLocations = locations.filter(
    location => location.isCompleted
  ).length;

  const numberOfRequestedLocations = locations.filter(
    location => !!location.contactedAt
  ).length;

  const requestedStatus = locations.some(location => !location.contactedAt)
    ? TRACE_PROCESS_STATUS_TYPES.REQUEST_PARTIAL
    : TRACE_PROCESS_STATUS_TYPES.REQUESTED;

  if (numberOfRequestedLocations === 0) return TRACE_PROCESS_STATUS_TYPES.NONE;

  if (numberOfCompletedLocations === 0) return requestedStatus;

  return numberOfCompletedLocations === locations.length
    ? TRACE_PROCESS_STATUS_TYPES.ALL
    : TRACE_PROCESS_STATUS_TYPES.PARTIAL;
}

/**
 * Retrieves information about all tracing processes for the health department
 * of the requesting employee. This is used for display in the health
 * department frontend.
 */
router.get('/', requireHealthDepartmentEmployee, async (request, response) => {
  const processes = await database.TracingProcess.findAll({
    where: {
      departmentId: request.user.departmentId,
    },
    include: [
      {
        model: database.LocationTransfer,
        attributes: ['tracingProcessId', 'isCompleted', 'contactedAt'],
      },
      {
        model: database.HealthDepartmentEmployee,
        attributes: ['uuid', 'firstName', 'lastName'],
      },
    ],
  });

  return response.send(
    processes.map(tracingProcess => {
      const assignee = tracingProcess.HealthDepartmentEmployee;
      return {
        uuid: tracingProcess.uuid,
        status: getTraceProcessStatus(tracingProcess),
        userTransferId: tracingProcess.userTransferId,
        didRequestLocations: tracingProcess.didRequestLocations,
        isCompleted: tracingProcess.isCompleted,
        createdAt: moment(tracingProcess.createdAt).unix(),
        assignee: assignee
          ? pick(assignee, ['uuid', 'firstName', 'lastName'])
          : null,
      };
    })
  );
});

/**
 * Gets a tracing process by its Id.
 */
router.get(
  '/:tracingProcessId',
  validateParametersSchema(tracingProcessIdParametersSchema),
  requireHealthDepartmentEmployee,
  async (request, response) => {
    const tracingProcess = await database.TracingProcess.findOne({
      where: {
        departmentId: request.user.departmentId,
        uuid: request.params.tracingProcessId,
      },
      include: [
        {
          model: database.LocationTransfer,
          attributes: ['tracingProcessId', 'isCompleted', 'contactedAt'],
        },
        {
          model: database.HealthDepartmentEmployee,
          attributes: ['uuid', 'firstName', 'lastName'],
        },
      ],
    });

    if (!tracingProcess) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.send({
      uuid: tracingProcess.uuid,
      status: getTraceProcessStatus(tracingProcess),
      userTransferId: tracingProcess.userTransferId,
      didRequestLocations: tracingProcess.didRequestLocations,
      isCompleted: tracingProcess.isCompleted,
      createdAt: moment(tracingProcess.createdAt).unix(),
      assignee: tracingProcess.HealthDepartmentEmployee,
    });
  }
);

/**
 * Updates the status of a tracing process.
 */
router.patch(
  '/:tracingProcessId',
  requireHealthDepartmentEmployee,
  validateParametersSchema(tracingProcessIdParametersSchema),
  validateSchema(patchSchema),
  async (request, response) => {
    const tracingProcess = await database.TracingProcess.findOne({
      where: {
        uuid: request.params.tracingProcessId,
        departmentId: request.user.departmentId,
      },
    });
    if (!tracingProcess) {
      return response.sendStatus(status.NOT_FOUND);
    }

    if (request.body.assigneeId) {
      const assignee = await database.HealthDepartmentEmployee.findOne({
        where: {
          uuid: request.body.assigneeId,
          departmentId: request.user.departmentId,
        },
      });
      if (!assignee) {
        return response.sendStatus(status.NOT_FOUND);
      }
    }
    await tracingProcess.update({
      didRequestLocations: request.body.didRequestLocations,
      isCompleted: request.body.isCompleted,
      assigneeId: request.body.assigneeId,
    });
    return response.sendStatus(status.NO_CONTENT);
  }
);

/**
 * Retrieves all location transfers of a tracing process, showing which
 * location has been contacted and which already has decrypted the outer
 * layer of encryption.
 *
 * @see https://www.luca-app.de/securityoverview/processes/tracing_find_contacts.html#process
 */
router.get(
  '/:tracingProcessId/locationTransfers',
  requireHealthDepartmentEmployee,
  validateParametersSchema(tracingProcessIdParametersSchema),
  async (request, response) => {
    const transfers = await database.LocationTransfer.findAll({
      where: {
        tracingProcessId: request.params.tracingProcessId,
        departmentId: request.user.departmentId,
      },
    });

    return response.send(
      transfers.map(transfer => ({
        locationId: transfer.locationId,
        time: [
          moment(transfer.time[0].value).unix(),
          moment(transfer.time[1].value).unix(),
        ],
        isCompleted: transfer.isCompleted,
        uuid: transfer.uuid,
        contactedAt: transfer.contactedAt,
      }))
    );
  }
);

module.exports = router;
