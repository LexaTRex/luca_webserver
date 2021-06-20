/**
 * @overview Provides endpoints to retrieve information on issuer (a health
 * department) of, for instance, a daily key, in order to verify its authenticity
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-HDSKP
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-HDEKP
 */
const router = require('express').Router();
const status = require('http-status');

const {
  validateParametersSchema,
} = require('../../../middlewares/validateSchema');

const database = require('../../../database');

const { issuerIdParametersSchema } = require('./issuers.schemas');

/**
 * Retrieve all issuers including their respective HDEKP and HDSKP
 * @see https://www.luca-app.de/securityoverview/properties/actors.html#term-Health-Department
 */
router.get('/', async (request, response) => {
  const healthDepartments = await database.HealthDepartment.findAll();

  const payload = healthDepartments.map(department => ({
    issuerId: department.uuid,
    name: department.name,
    publicHDEKP: department.publicHDEKP,
    publicHDSKP: department.publicHDSKP,
  }));

  return response.send(payload);
});

/**
 * Retrieve a specific issuer including their respective HDEKP and HDSKP
 * Most prominently used to verify the authenticity of a daily key by the Guest app
 * @see https://www.luca-app.de/securityoverview/properties/actors.html#term-Health-Department
 */
router.get(
  '/:issuerId',
  validateParametersSchema(issuerIdParametersSchema),
  async (request, response) => {
    const healthDepartment = await database.HealthDepartment.findByPk(
      request.params.issuerId
    );
    if (!healthDepartment) {
      return response.send(status.NOT_FOUND);
    }

    return response.send({
      issuerId: healthDepartment.uuid,
      name: healthDepartment.name,
      publicHDEKP: healthDepartment.publicHDEKP,
      publicHDSKP: healthDepartment.publicHDSKP,
    });
  }
);

module.exports = router;
