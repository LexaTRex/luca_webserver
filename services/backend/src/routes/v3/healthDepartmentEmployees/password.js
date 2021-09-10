const router = require('express').Router();
const status = require('http-status');
const database = require('../../../database');
const { validateSchema } = require('../../../middlewares/validateSchema');
const {
  requireHealthDepartmentEmployee,
  requireHealthDepartmentAdmin,
} = require('../../../middlewares/requireUser');

const mailClient = require('../../../utils/mailClient');
const { generatePassword } = require('../../../utils/generators');

const { limitRequestsPerHour } = require('../../../middlewares/rateLimit');

const { changePasswordSchema, renewSchema } = require('./password.schemas');
const {
  AuditLogEvents,
  AuditStatusType,
} = require('../../../constants/auditLog');
const { logEvent } = require('../../../utils/hdAuditLog');

// change password
router.post(
  '/change',
  limitRequestsPerHour('hd_password_change_post_ratelimit_hour', {
    skipSuccessfulRequests: true,
  }),
  requireHealthDepartmentEmployee,
  validateSchema(changePasswordSchema),
  async (request, response) => {
    const employee = request.user;
    const { currentPassword, newPassword, lang } = request.body;

    const isCurrentPasswordCorrect = await employee.checkPassword(
      currentPassword
    );

    if (!isCurrentPasswordCorrect) {
      logEvent(employee, {
        type: AuditLogEvents.CHANGE_PASSWORD,
        status: AuditStatusType.ERROR_INVALID_PASSWORD,
      });

      return response.sendStatus(status.FORBIDDEN);
    }

    await employee.update({
      password: newPassword,
    });

    mailClient.hdUpdatePasswordNotification(
      employee.email,
      `${employee.firstName} ${employee.lastName}`,
      lang,
      {
        email: employee.email,
      }
    );

    logEvent(employee, {
      type: AuditLogEvents.CHANGE_PASSWORD,
      status: AuditStatusType.SUCCESS,
      meta: {
        target: employee.uuid,
      },
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

router.patch(
  '/renew',
  limitRequestsPerHour('hd_password_renew_patch_ratelimit_hour', {
    skipSuccessfulRequests: true,
  }),
  requireHealthDepartmentAdmin,
  validateSchema(renewSchema),
  async (request, response) => {
    const employee = await database.HealthDepartmentEmployee.findByPk(
      request.body.employeeId
    );

    if (employee.departmentId !== request.user.departmentId) {
      logEvent(request.user, {
        type: AuditLogEvents.RESET_PASSWORD,
        status: AuditStatusType.ERROR_TARGET_NOT_FOUND,
        meta: {
          target: employee.uuid,
        },
      });

      return response.sendStatus(status.FORBIDDEN);
    }

    const newPassword = generatePassword(8);

    employee.update({ password: newPassword });

    logEvent(request.user, {
      type: AuditLogEvents.RESET_PASSWORD,
      status: AuditStatusType.SUCCESS,
      meta: {
        target: employee.uuid,
      },
    });

    response.status(status.OK);
    return response.send({ password: newPassword });
  }
);

module.exports = router;
