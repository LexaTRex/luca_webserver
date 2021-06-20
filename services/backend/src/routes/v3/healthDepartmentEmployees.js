const router = require('express').Router();
const status = require('http-status');
const crypto = require('crypto');
const { generatePassword } = require('../../utils/generators');

const database = require('../../database');
const {
  validateSchema,
  validateParametersSchema,
} = require('../../middlewares/validateSchema');
const {
  requireHealthDepartmentAdmin,
  requireHealthDepartmentEmployee,
} = require('../../middlewares/requireUser');
const passwordRouter = require('./healthDepartmentEmployees/password');
const locationsRouter = require('./healthDepartmentEmployees/locations');

const {
  createSchema,
  updateSchema,
  employeeIdParametersSchema,
} = require('./healthDepartmentEmployees.schemas');

// HD get all employees
router.get('/', requireHealthDepartmentEmployee, async (request, response) => {
  const healthDepartmentEmployees = await database.HealthDepartmentEmployee.findAll(
    {
      where: {
        departmentId: request.user.departmentId,
      },
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
});

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
      return response.sendStatus(status.NOT_FOUND);
    }

    await employee.destroy({ force: true });
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
      return response.sendStatus(status.NOT_FOUND);
    }

    await employee.update({
      isAdmin: request.body.isAdmin,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      phone: request.body.phone,
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
    const healthDepartment = await database.HealthDepartment.findOne({
      where: {
        uuid: request.user.departmentId,
      },
    });

    if (!healthDepartment) {
      return response.sendStatus(status.NOT_FOUND);
    }

    const initialPassword = generatePassword(8);

    await database.HealthDepartmentEmployee.create({
      email: request.body.email,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      phone: request.body.phone,
      isAdmin: false,
      departmentId: request.user.departmentId,
      password: initialPassword,
      salt: crypto.randomBytes(16).toString('base64'),
    });

    response.status(status.CREATED);
    return response.send({ password: initialPassword });
  }
);

router.use('/password', passwordRouter);
router.use('/locations', locationsRouter);

module.exports = router;
