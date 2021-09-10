const router = require('express').Router();
const status = require('http-status');
const crypto = require('crypto');

const { AuditLogEvents, AuditStatusType } = require('../../constants/auditLog');
const { generatePassword } = require('../../utils/generators');
const { logEvent } = require('../../utils/hdAuditLog');

const database = require('../../database');
const {
  validateSchema,
  validateQuerySchema,
  validateParametersSchema,
} = require('../../middlewares/validateSchema');
const {
  requireHealthDepartmentAdmin,
  requireHealthDepartmentEmployee,
} = require('../../middlewares/requireUser');
const passwordRouter = require('./healthDepartmentEmployees/password');
const locationsRouter = require('./healthDepartmentEmployees/locations');

const {
  getSchema,
  createSchema,
  updateSchema,
  employeeIdParametersSchema,
} = require('./healthDepartmentEmployees.schemas');

// HD get all employees
router.get(
  '/',
  requireHealthDepartmentEmployee,
  validateQuerySchema(getSchema),
  async (request, response) => {
    const healthDepartmentEmployees = await database.HealthDepartmentEmployee.findAll(
      {
        where: {
          departmentId: request.user.departmentId,
        },
        paranoid:
          request.query.includeDeleted === undefined ||
          request.query.includeDeleted === 'false',
      }
    );

    return response.send(
      healthDepartmentEmployees.map(employee => ({
        uuid: employee.uuid,
        email: employee.email,
        phone: employee.phone,
        firstName: employee.firstName,
        lastName: employee.lastName,
        isAdmin: employee.isAdmin,
      }))
    );
  }
);

// delete employees
router.delete(
  '/:employeeId',
  requireHealthDepartmentAdmin,
  validateParametersSchema(employeeIdParametersSchema),
  async (request, response) => {
    const employee = await database.HealthDepartmentEmployee.findOne({
      where: {
        uuid: request.params.employeeId,
        departmentId: request.user.departmentId,
      },
    });

    if (!employee) {
      logEvent(request.user, {
        type: AuditLogEvents.DELETE_EMPLOYEE,
        status: AuditStatusType.ERROR_TARGET_NOT_FOUND,
      });
      return response.sendStatus(status.NOT_FOUND);
    }

    await employee.update({
      firstName: null,
      lastName: null,
      phone: null,
    });
    await database.TracingProcess.update(
      { assigneeId: null },
      { where: { assigneeId: request.params.employeeId } }
    );

    await employee.destroy();

    logEvent(request.user, {
      type: AuditLogEvents.DELETE_EMPLOYEE,
      status: AuditStatusType.SUCCESS,
      meta: {
        target: employee.uuid,
      },
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

// update employees
router.patch(
  '/:employeeId',
  requireHealthDepartmentAdmin,
  validateSchema(updateSchema),
  validateParametersSchema(employeeIdParametersSchema),
  async (request, response) => {
    const employee = await database.HealthDepartmentEmployee.findOne({
      where: {
        uuid: request.params.employeeId,
        departmentId: request.user.departmentId,
      },
    });

    if (!employee) {
      logEvent(request.user, {
        type: AuditLogEvents.UPDATE_EMPLOYEE,
        status: AuditStatusType.ERROR_TARGET_NOT_FOUND,
      });

      return response.sendStatus(status.NOT_FOUND);
    }

    if (
      typeof request.body.isAdmin !== 'undefined' &&
      employee.isAdmin !== request.body.isAdmin
    ) {
      logEvent(request.user, {
        type: AuditLogEvents.CHANGE_ROLE,
        status: AuditStatusType.SUCCESS,
        meta: {
          target: employee.uuid,
          isAdmin: request.body.isAdmin,
        },
      });
    }

    await employee.update({
      isAdmin: request.body.isAdmin,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      phone: request.body.phone,
    });

    logEvent(request.user, {
      type: AuditLogEvents.UPDATE_EMPLOYEE,
      status: AuditStatusType.SUCCESS,
      meta: {
        target: employee.uuid,
        attributes: {
          firstName: request.body.firstName !== undefined,
          lastName: request.body.lastName !== undefined,
          phone: request.body.phone !== undefined,
          isAdmin: request.body.isAdmin !== undefined,
        },
      },
    });

    return response.sendStatus(status.NO_CONTENT);
  }
);

// HD create new employee
router.post(
  '/',
  requireHealthDepartmentAdmin,
  validateSchema(createSchema),
  async (request, response) => {
    const initialPassword = generatePassword(8);

    const existingEmployee = await database.HealthDepartmentEmployee.findOne({
      where: {
        email: request.body.email,
        departmentId: request.user.departmentId,
      },
      paranoid: false,
    });

    if (existingEmployee) {
      const isDeletedEmployee = !!existingEmployee.deletedAt;

      if (isDeletedEmployee) {
        await existingEmployee.restore();
        await existingEmployee.update({
          firstName: request.body.firstName,
          lastName: request.body.lastName,
          phone: request.body.phone,
          password: initialPassword,
          isAdmin: false,
          salt: crypto.randomBytes(16).toString('base64'),
        });

        logEvent(request.user, {
          type: AuditLogEvents.REACTIVATE_EMPLOYEE,
          status: AuditStatusType.SUCCESS,
          meta: {
            target: existingEmployee.uuid,
          },
        });
      } else {
        return response.sendStatus(status.CONFLICT);
      }
    } else {
      const employee = await database.HealthDepartmentEmployee.create({
        email: request.body.email,
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        phone: request.body.phone,
        isAdmin: false,
        departmentId: request.user.departmentId,
        password: initialPassword,
        salt: crypto.randomBytes(16).toString('base64'),
      });

      logEvent(request.user, {
        type: AuditLogEvents.CREATE_EMPLOYEE,
        status: AuditStatusType.SUCCESS,
        meta: {
          target: employee.uuid,
        },
      });
    }

    response.status(status.CREATED);
    return response.send({ password: initialPassword });
  }
);

router.use('/password', passwordRouter);
router.use('/locations', locationsRouter);

module.exports = router;
