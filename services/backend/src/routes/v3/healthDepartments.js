const router = require('express').Router();
const status = require('http-status');

const database = require('../../database');

const {
  validateSchema,
  validateParametersSchema,
} = require('../../middlewares/validateSchema');
const {
  requireHealthDepartmentEmployee,
} = require('../../middlewares/requireUser');

const {
  storeKeysSchema,
  departmentIdParametersSchema,
} = require('./healthDepartments.schemas');

// HD get own public keys
router.get(
  '/keys',
  requireHealthDepartmentEmployee,
  async (request, response) => {
    const department = await database.HealthDepartment.findByPk(
      request.user.departmentId
    );

    if (!department) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.send({
      publicHDEKP: department.publicHDEKP,
      publicHDSKP: department.publicHDSKP,
    });
  }
);

// HD set own public keys
router.post(
  '/keys',
  requireHealthDepartmentEmployee,
  validateSchema(storeKeysSchema),
  async (request, response) => {
    const department = await database.HealthDepartment.findByPk(
      request.user.departmentId
    );

    if (!department) {
      return response.sendStatus(status.NOT_FOUND);
    }

    if (department.publicHDEKP) {
      return response.sendStatus(status.FORBIDDEN);
    }

    await department.update({
      publicHDEKP: request.body.publicHDEKP,
      publicHDSKP: request.body.publicHDSKP,
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

// HD get privateKeySecret
router.get(
  '/privateKeySecret',
  requireHealthDepartmentEmployee,
  async (request, response) => {
    const department = await database.HealthDepartment.findByPk(
      request.user.departmentId
    );

    if (!department) {
      return response.sendStatus(status.NOT_FOUND);
    }

    return response.send({ privateKeySecret: department.privateKeySecret });
  }
);

// get a single health department
router.get(
  '/:departmentId',
  validateParametersSchema(departmentIdParametersSchema),
  async (request, response) => {
    const department = await database.HealthDepartment.findByPk(
      request.params.departmentId
    );
    if (!department) {
      return response.send(status.NOT_FOUND);
    }

    return response.send({
      departmentId: department.uuid,
      name: department.name,
      publicHDEKP: department.publicHDEKP,
      publicHDSKP: department.publicHDSKP,
    });
  }
);

module.exports = router;
