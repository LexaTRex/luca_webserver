const router = require('express').Router();
const {
  requireEnabledFeature,
} = require('../../../middlewares/requireEnabledFeature');
const {
  validateParametersSchema,
} = require('../../../middlewares/validateSchema');

const database = require('../../../database');
const { ApiError, ApiErrorType } = require('../../../utils/apiError');

const { issuerIdParametersSchema } = require('./issuers.schemas');

// get all issuers
router.get(
  '/',
  requireEnabledFeature('v4_signed_public_keys'),
  async (request, response) => {
    const healthDepartments = await database.HealthDepartment.findAll();

    return response.send(
      healthDepartments.map(department => ({
        issuerId: department.uuid,
        publicCertificate: department.publicCertificate,
        signedPublicHDEKP: department.signedPublicHDEKP,
        signedPublicHDSKP: department.signedPublicHDSKP,
      }))
    );
  }
);

// get single issuer
router.get(
  '/:issuerId',
  requireEnabledFeature('v4_signed_public_keys'),
  validateParametersSchema(issuerIdParametersSchema),
  async (request, response) => {
    const healthDepartment = await database.HealthDepartment.findByPk(
      request.params.issuerId
    );

    if (!healthDepartment) {
      throw new ApiError(ApiErrorType.HEALTH_DEPARTMENT_NOT_FOUND);
    }

    return response.send({
      uuid: healthDepartment.uuid,
      publicCertificate: healthDepartment.publicCertificate,
      signedPublicHDEKP: healthDepartment.signedPublicHDEKP,
      signedPublicHDSKP: healthDepartment.signedPublicHDSKP,
    });
  }
);

module.exports = router;
