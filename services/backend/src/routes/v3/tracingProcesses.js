const router = require('express').Router();
const status = require('http-status');
const moment = require('moment');

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

// get all processes
router.get('/', requireHealthDepartmentEmployee, async (request, response) => {
  const processes = await database.TracingProcess.findAll({
    where: {
      departmentId: request.user.departmentId,
    },
    include: {
      model: database.LocationTransfer,
      attributes: ['tracingProcessId', 'isCompleted', 'contactedAt'],
    },
  });

  return response.send(
    processes.map(tracingProcess => ({
      uuid: tracingProcess.uuid,
      status: getTraceProcessStatus(tracingProcess),
      userTransferId: tracingProcess.userTransferId,
      didRequestLocations: tracingProcess.didRequestLocations,
      isCompleted: tracingProcess.isCompleted,
      createdAt: moment(tracingProcess.createdAt).unix(),
    }))
  );
});

// update process
router.patch(
  '/:tracingProcessId',
  requireHealthDepartmentEmployee,
  validateParametersSchema(tracingProcessIdParametersSchema),
  validateSchema(patchSchema),
  async (request, response) => {
    const process = await database.TracingProcess.findOne({
      where: {
        uuid: request.params.tracingProcessId,
        departmentId: request.user.departmentId,
      },
    });

    await process.update(request.body);

    return response.sendStatus(status.NO_CONTENT);
  }
);

// get transfers of a process
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
