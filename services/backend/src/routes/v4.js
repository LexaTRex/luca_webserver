const router = require('express').Router();

const authRouter = require('./v4/auth');
const keysRouter = require('./v4/keys');
const timeRouter = require('./v4/time');
const healthDepartmentsRouter = require('./v4/healthDepartments');
const healthDepartmentEmployeesRouter = require('./v4/healthDepartmentEmployees');

router.use('/auth', authRouter);
router.use('/keys', keysRouter);
router.use('/time', timeRouter);
router.use('/healthDepartments', healthDepartmentsRouter);
router.use('/healthDepartmentEmployees', healthDepartmentEmployeesRouter);

module.exports = router;
