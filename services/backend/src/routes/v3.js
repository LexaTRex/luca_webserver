const router = require('express').Router();

const authRouter = require('./v3/auth');
const healthRouter = require('./v3/health');
const keysRouter = require('./v3/keys');
const versionsRouter = require('./v3/versions');
const smsRouter = require('./v3/sms');
const usersRouter = require('./v3/users');
const operatorsRouter = require('./v3/operators');
const locationsRouter = require('./v3/locations');
const locationGroupsRouter = require('./v3/locationGroups');
const scannersRouter = require('./v3/scanners');
const formsRouter = require('./v3/forms');
const testsRouter = require('./v3/tests');
const tracesRouter = require('./v3/traces');
const notificationsRouter = require('./v3/notifications');
const healthDepartmentsRouter = require('./v3/healthDepartments');
const userTransfersRouter = require('./v3/userTransfers');
const locationTransfersRouter = require('./v3/locationTransfers');
const locationTransferGroupsRouter = require('./v3/locationTransferGroups');
const badgeRegistratorsRouter = require('./v3/badgeRegistrators');
const tracingProcessesRouter = require('./v3/tracingProcesses');
const supportedZipCodesRouter = require('./v3/supportedZipCodes');
const healthDepartmentEmployeesRouter = require('./v3/healthDepartmentEmployees');
const timesyncRouter = require('./v3/timesync');
const swaggerRouter = require('./v3/swagger');

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Manage authentication.
 */
router.use('/auth', authRouter);
/**
 * @openapi
 * tags:
 *   name: Health
 *   description: Get system health status.
 */
router.use('/health', healthRouter);
/**
 * @openapi
 * tags:
 *   name: Keys
 *   description: Manage keys.
 */
router.use('/keys', keysRouter);
/**
 * @openapi
 * tags:
 *   name: Versions
 *   description: Get required app version information.
 */
router.use('/versions', versionsRouter);
/**
 * @openapi
 * tags:
 *   name: SMS
 *   description: Handle SMS TAN requests and verification.
 */
router.use('/sms', smsRouter);
/**
 * @openapi
 * tags:
 *   name: Users
 *   description: Manage users.
 */
router.use('/users', usersRouter);
/**
 * @openapi
 * tags:
 *   name: Operators
 *   description: Manage venue operators (also referred to as [Venue Owners](https://luca-app.de/securityconcept/properties/actors.html#term-Venue-Owner)).
 */
router.use('/operators', operatorsRouter);
/**
 * @openapi
 * tags:
 *   name: Locations
 *   description: Manage locations (public routes).
 */
router.use('/locations', locationsRouter);
/**
 * @openapi
 * tags:
 *   name: LocationGroups
 *   description: Manage location groups.
 */
router.use('/locationGroups', locationGroupsRouter);
/**
 * @openapi
 * tags:
 *   name: Scanners
 *   description: Manage [scanners](https://luca-app.de/securityconcept/properties/actors.html#term-Scanner-Frontend).
 */
router.use('/scanners', scannersRouter);
/**
 * @openapi
 * tags:
 *   name: Forms
 *   description: Manage [contact-form](https://luca-app.de/securityconcept/properties/actors.html#term-Web-Check-In-Frontend).
 */
router.use('/forms', formsRouter);
/**
 * @openapi
 * tags:
 *   name: Tests
 *   description: Manage tests.
 */
router.use('/tests', testsRouter);
/**
 * @openapi
 * tags:
 *   name: Traces
 *   description: Manage [traces](https://luca-app.de/securityconcept/properties/secrets.html#term-trace-ID).
 */
router.use('/traces', tracesRouter);
/**
 * @openapi
 * tags:
 *   name: Notifications
 *   description: Manage notifications.
 */
router.use('/notifications', notificationsRouter);
/**
 * @openapi
 * tags:
 *   name: HealthDepartments
 *   description: Manage health departments.
 */
router.use('/healthDepartments', healthDepartmentsRouter);
/**
 * @openapi
 * tags:
 *   name: UserTransfers
 *   description: Manage user transfers.
 */
router.use('/userTransfers', userTransfersRouter);
/**
 * @openapi
 * tags:
 *   name: LocationTransfers
 *   description: Manage location transfers.
 */
router.use('/locationTransfers', locationTransfersRouter);
/**
 * @openapi
 * tags:
 *   name: LocationTransferGroups
 *   description: Manage location transfer groups.
 */
router.use('/locationTransferGroups', locationTransferGroupsRouter);
/**
 * @openapi
 * tags:
 *   name: BadgeRegistrators
 *   description: Manage badge registrators.
 */
router.use('/badgeRegistrators', badgeRegistratorsRouter);
/**
 * @openapi
 * tags:
 *   name: TracingProcesses
 *   description: Manage tracing processes.
 */
router.use('/tracingProcesses', tracingProcessesRouter);
/**
 * @openapi
 * tags:
 *   name: SupportedZipCodes
 *   description: Get supported location information.
 */
router.use('/supportedZipCodes', supportedZipCodesRouter);
/**
 * @openapi
 * tags:
 *   name: HealthDepartmentEmployees
 *   description: Manage health department employees.
 */
router.use('/healthDepartmentEmployees', healthDepartmentEmployeesRouter);
/**
 * @openapi
 * tags:
 *   name: Server Time
 *   description: Check server time
 */
router.use('/timesync', timesyncRouter);

router.use('/swagger', swaggerRouter);

module.exports = router;
