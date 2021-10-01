const router = require('express').Router();

const authRouter = require('./v4/auth');
const keysRouter = require('./v4/keys');
const timeRouter = require('./v4/time');
const healthDepartmentsRouter = require('./v4/healthDepartments');
const healthDepartmentEmployeesRouter = require('./v4/healthDepartmentEmployees');
const signingToolRouter = require('./v4/signingToolDownload');
const locationTransfersRouter = require('./v4/locationTransfers');
const notificationsRouter = require('./v4/notifications');
const riskLevelsRouter = require('./v4/riskLevels');

router.use('/auth', authRouter);
router.use('/keys', keysRouter);
router.use('/time', timeRouter);
router.use('/healthDepartments', healthDepartmentsRouter);
router.use('/healthDepartmentEmployees', healthDepartmentEmployeesRouter);
router.use('/signingTool', signingToolRouter);
router.use('/locationTransfers', locationTransfersRouter);
router.use('/notifications', notificationsRouter);
router.use('/riskLevels', riskLevelsRouter);

module.exports = router;
