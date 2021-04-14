const router = require('express').Router();
const status = require('http-status');

const {
  validateParametersSchema,
} = require('../../../middlewares/validateSchema');

const database = require('../../../database');

const { issuerIdParametersSchema } = require('./issuers.schemas');

// get all issuers
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

// get single issuer
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
