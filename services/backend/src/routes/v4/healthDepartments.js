const router = require('express').Router();
const config = require('config');
const moment = require('moment-timezone');
const status = require('http-status');
const { Op } = require('sequelize');

const database = require('../../database');
const ApiError = require('../../utils/apiError');

const {
  validateSchema,
  validateParametersSchema,
  validateQuerySchema,
} = require('../../middlewares/validateSchema');
const {
  requireHealthDepartmentEmployee,
  requireHealthDepartmentAdmin,
} = require('../../middlewares/requireUser');

const { verifySignedPublicKeys } = require('../../utils/signedKeys');
const { AuditLogEvents, AuditStatusType } = require('../../constants/auditLog');
const { logEvent, entriesToPlainText } = require('../../utils/hdAuditLog');

const {
  storeSignedKeysSchema,
  departmentIdParametersSchema,
  auditLogDownloadQuerySchema,
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
      throw new ApiError(ApiError.HEALTH_DEPARTMENT_NOT_FOUND);
    }

    // check that signed keys do not exist yet
    if (department.signedPublicHDEKP || department.signedPublicHDSKP) {
      throw new ApiError(ApiError.SIGNED_KEYS_ALREADY_EXIST);
    }

    try {
      verifySignedPublicKeys(
        department,
        request.body.publicCertificate,
        request.body.signedPublicHDSKP,
        request.body.signedPublicHDEKP
      );
    } catch (error) {
      throw new ApiError(ApiError.INVALID_SIGNED_KEYS, error.message);
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
      throw new ApiError(ApiError.HEALTH_DEPARTMENT_NOT_FOUND);
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
  requireHealthDepartmentAdmin,
  validateQuerySchema(auditLogDownloadQuerySchema),
  async (request, response) => {
    const entries = await database.HealthDepartmentAuditLog.findAll({
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

    response.set('Content-Type', 'text/plain');
    return response.send(entriesToPlainText(entries));
  }
);

module.exports = router;
