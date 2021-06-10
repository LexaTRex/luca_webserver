const router = require('express').Router();
const status = require('http-status');
const database = require('../../../database');
const { validateSchema } = require('../../../middlewares/validateSchema');
const {
  requireHealthDepartmentEmployee,
  requireHealthDepartmentAdmin,
} = require('../../../middlewares/requireUser');

const { generatePassword } = require('../../../utils/generators');

const { limitRequestsPerHour } = require('../../../middlewares/rateLimit');

const { changePasswordSchema, renewSchema } = require('./password.schemas');

// change password
router.post(
  '/change',
  limitRequestsPerHour(15, { skipSuccessfulRequests: true }),
  requireHealthDepartmentEmployee,
  validateSchema(changePasswordSchema),
  async (request, response) => {
    const employee = request.user;

    const isCurrentPasswordCorrect = await employee.checkPassword(
      request.body.currentPassword
    );

    if (!isCurrentPasswordCorrect) {
      return response.sendStatus(status.FORBIDDEN);
    }

    await employee.update({
      password: request.body.newPassword,
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

router.patch(
  '/renew',
  limitRequestsPerHour(15, { skipSuccessfulRequests: true }),
  requireHealthDepartmentAdmin,
  validateSchema(renewSchema),
  async (request, response) => {
    const employee = await database.HealthDepartmentEmployee.findByPk(
      request.body.employeeId
    );

    if (employee.departmentId !== request.user.departmentId) {
      return response.sendStatus(status.FORBIDDEN);
    }

    const newPassword = generatePassword(8);

    employee.update({ password: newPassword });

    response.status(status.OK);
    return response.send({ password: newPassword });
  }
);

module.exports = router;
