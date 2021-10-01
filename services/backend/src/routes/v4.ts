import { Router } from 'express';
import authRouter from './v4/auth';
import keysRouter from './v4/keys';
import timeRouter from './v4/time';
import riskLevelsRouter from './v4/riskLevels';
import challengesRouter from './v4/challenges';
import clientConfigsRouter from './v4/clientConfigs';
import notificationsRouter from './v4/notifications';
import operatorDevicesRouter from './v4/operatorDevices';
import signingToolRouter from './v4/signingToolDownload';
import locationTransfersRouter from './v4/locationTransfers';
import healthDepartmentsRouter from './v4/healthDepartments';
import healthDepartmentEmployeesRouter from './v4/healthDepartmentEmployees';

const router = Router();

router.use('/auth', authRouter);
router.use('/keys', keysRouter);
router.use('/time', timeRouter);
router.use('/healthDepartments', healthDepartmentsRouter);
router.use('/healthDepartmentEmployees', healthDepartmentEmployeesRouter);
router.use('/signingTool', signingToolRouter);
router.use('/locationTransfers', locationTransfersRouter);
router.use('/notifications', notificationsRouter);
router.use('/riskLevels', riskLevelsRouter);
router.use('/clientConfigs', clientConfigsRouter);
router.use('/challenges', challengesRouter);
router.use('/operatorDevices', operatorDevicesRouter);

export default router;
