const router = require('express').Router();
const config = require('config');
const moment = require('moment-timezone');
const status = require('http-status');
const { Op } = require('sequelize');

const database = require('../../database');
const { ApiError, ApiErrorType } = require('../../utils/apiError');
const { verifySignedPublicKeys } = require('../../utils/signedKeys');

const {
  limitRequestsByUserPerHour,
  limitRequestsPerHour,
  limitRequestsByUserPerMinute,
  limitRequestsPerMinute,
} = require('../../middlewares/rateLimit');
const {
  validateSchema,
  validateParametersSchema,
  validateQuerySchema,
} = require('../../middlewares/validateSchema');
const {
  requireHealthDepartmentEmployee,
  requireHealthDepartmentAdmin,
} = require('../../middlewares/requireUser');

const { AuditLogEvents, AuditStatusType } = require('../../constants/auditLog');
const { logEvent, AuditLogTransformer } = require('../../utils/hdAuditLog');

const {
  storeSignedKeysSchema,
  departmentIdParametersSchema,
  auditLogDownloadQuerySchema,
  auditLogDownloadEventSchema,
  auditLogExportEventSchema,
} = require('./healthDepartments.schemas');

// set signed keys
router.post(
  '/signedKeys',
  requireHealthDepartmentAdmin,
  validateSchema(storeSignedKeysSchema),
  async (request, response) => {
    const department = await database.HealthDepartment.findByPk(
      request.user.departmentId
    );

    if (!department) {
      throw new ApiError(ApiErrorType.HEALTH_DEPARTMENT_NOT_FOUND);
    }

    // check that signed keys do not exist yet
    if (department.signedPublicHDEKP || department.signedPublicHDSKP) {
      throw new ApiError(ApiErrorType.SIGNED_KEYS_ALREADY_EXIST);
    }

    try {
      verifySignedPublicKeys(
        department,
        request.body.publicCertificate,
        request.body.signedPublicHDSKP,
        request.body.signedPublicHDEKP
      );
    } catch (error) {
      throw new ApiError(ApiErrorType.INVALID_SIGNED_KEYS, error.message);
    }

    await department.update({
      publicCertificate: request.body.publicCertificate,
      signedPublicHDEKP: request.body.signedPublicHDEKP,
      signedPublicHDSKP: request.body.signedPublicHDSKP,
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

// get a single health department
router.get(
  '/:departmentId',
  requireHealthDepartmentEmployee,
  validateParametersSchema(departmentIdParametersSchema),
  async (request, response) => {
    const department = await database.HealthDepartment.findByPk(
      request.params.departmentId
    );

    if (!department) {
      throw new ApiError(ApiErrorType.HEALTH_DEPARTMENT_NOT_FOUND);
    }

    return response.send({
      uuid: department.uuid,
      name: department.name,
      commonName: department.commonName,
      publicHDEKP: department.publicHDEKP,
      publicHDSKP: department.publicHDSKP,
      publicCertificate: department.publicCertificate,
      signedPublicHDEKP: department.signedPublicHDEKP,
      signedPublicHDSKP: department.signedPublicHDSKP,
      email: department.email,
      phone: department.phone,
    });
  }
);

router.get(
  '/auditlog/download',
  limitRequestsPerMinute('audit_log_download_ratelimit_minute'),
  limitRequestsPerHour('audit_log_download_ratelimit_hour'),
  requireHealthDepartmentAdmin,
  limitRequestsByUserPerMinute('audit_log_download_ratelimit_user_minute'),
  limitRequestsByUserPerHour('audit_log_download_ratelimit_user_hour'),
  validateQuerySchema(auditLogDownloadQuerySchema),
  async (request, response) => {
    const entryStream = database.HealthDepartmentAuditLog.findAllWithStream({
      batchSize: 500,
      isObjectMode: true,
      where: {
        departmentId: request.user.departmentId,
        createdAt: {
          [Op.lt]: moment.unix(request.query.timeframe[0]),
          [Op.gt]: moment.unix(request.query.timeframe[1]),
        },
      },
    });

    logEvent(request.user, {
      type: AuditLogEvents.DOWNLOAD_AUDITLOG,
      status: AuditStatusType.SUCCESS,
      meta: {
        timeframe: request.query.timeframe.map(time =>
          moment.unix(time).tz(config.get('tz')).format()
        ),
      },
    });

    const filename = `auditlog_${moment
      .unix(request.query.timeframe[1])
      .format('YYYY-MM-DD--HH-mm')}_${moment
      .unix(request.query.timeframe[0])
      .format('YYYY-MM-DD--HH-mm')}.log.txt`;

    response.set('Content-Type', 'text/plain');
    response.set('Content-Disposition', `attachment; filename="${filename}"`);
    entryStream
      .pipe(new AuditLogTransformer({ objectMode: true }))
      .pipe(response);
  }
);

router.post(
  '/auditlog/event/downloadTraces',
  requireHealthDepartmentEmployee,
  limitRequestsByUserPerHour('audit_log_event_download_traces_ratelimit_hour'),
  validateSchema(auditLogDownloadEventSchema),
  async (request, response) => {
    const { type, transferId, amount } = request.body;

    logEvent(request.user, {
      type: AuditLogEvents.DOWNLOAD_TRACES,
      status: AuditStatusType.SUCCESS,
      meta: {
        type,
        transferId,
        amount,
      },
    });

    return response.sendStatus(status.OK);
  }
);

router.post(
  '/auditlog/event/exportTraces',
  requireHealthDepartmentEmployee,
  limitRequestsByUserPerHour('audit_log_event_export_traces_ratelimit_hour'),
  validateSchema(auditLogExportEventSchema),
  async (request, response) => {
    const { transferId, amount } = request.body;

    logEvent(request.user, {
      type: AuditLogEvents.EXPORT_TRACES,
      status: AuditStatusType.SUCCESS,
      meta: {
        transferId,
        amount,
      },
    });

    return response.sendStatus(status.OK);
  }
);

module.exports = router;
