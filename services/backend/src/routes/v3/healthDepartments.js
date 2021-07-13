/**
 * @overview Provides endpoints allowing health departments to update their keys
 * and the public to retrieve the respective public keys
 * @see https://www.luca-app.de/securityoverview/properties/actors.html#term-Health-Department
 */
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

/**
 * Get the public keys of the currently logged in health department
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-HDSKP
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-HDEKP
 */
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

/**
 * Set the public keys of currently logged-in health department
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-HDSKP
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-HDEKP
 */
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

    if (department.publicHDEKP || department.publicHDSKP) {
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

/**
 * Get the public keys of a given health department, available publicly
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-HDSKP
 * @see https://www.luca-app.de/securityoverview/properties/secrets.html#term-HDEKP
 */
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
