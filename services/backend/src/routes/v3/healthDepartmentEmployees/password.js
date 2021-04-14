const router = require('express').Router();
const status = require('http-status');
const { validateSchema } = require('../../../middlewares/validateSchema');
const {
  requireHealthDepartmentEmployee,
} = require('../../../middlewares/requireUser');

const { limitRequestsPerHour } = require('../../../middlewares/rateLimit');

const { changePasswordSchema } = require('./password.schemas');

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

module.exports = router;
