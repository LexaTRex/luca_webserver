/* eslint-disable import/no-cycle */
import config from 'config';
import {
  Sequelize,
  Options,
  ConnectionError,
  ConnectionRefusedError,
  ConnectionTimedOutError,
} from 'sequelize';
import sequelizeStream from 'node-sequelize-stream';
import logger from 'utils/logger';
import { client } from 'utils/metrics';
import dbConfig from 'database/config';

import { initBadgeGenerators } from './models/badgeGenerators';
import { initBadgePublicKeys } from './models/badgePublicKeys';
import { initChallenges } from './models/challenge';
import { initDailyPublicKeys } from './models/dailyPublicKeys';
import { initDummyTraces, associateDummyTrace } from './models/dummyTrace';
import {
  initEmailActivations,
  associateEmailActivation,
} from './models/emailActivation';
import { initEncryptedBadgePrivateKeys } from './models/encryptedBadgePrivateKeys';
import { initEncryptedDailyPrivateKeys } from './models/encryptedDailyPrivateKeys';
import {
  initAdditionalDataSchemas,
  associateAdditionalDataSchema,
} from './models/additionalDataSchema';
import { initFeatureFlags } from './models/featureFlags';
import {
  initHealthDepartments,
  associateHealthDepartment,
} from './models/healthDepartment';
import {
  initHealthDepartmentAuditLogs,
  associateHealthDepartmentAuditLog,
} from './models/healthDepartmentAuditLog';
import {
  initHealthDepartmentEmployees,
  associateHealthDepartmentEmployee,
} from './models/healthDepartmentEmployee';
import { initInternalAccessUser } from './models/internalAccessUser';
import { initIPAddressAllowLists } from './models/ipAddressAllowList';
import { initIPAddressBlockList } from './models/ipAddressBlockList';
import { initIPAddressDenyLists } from './models/ipAddressDenyList';
import { initLocations, associateLocation } from './models/location';
import {
  initLocationGroups,
  associateLocationGroup,
} from './models/locationGroup';
import {
  initLocationTransfers,
  associateLocationTransfer,
} from './models/locationTransfer';
import {
  initLocationTransferTraces,
  associateLocationTransferTrace,
} from './models/locationTransferTrace';
import { initNotificationChunks } from './models/notificationChunk';
import {
  initNotificationMessages,
  associateNotificationMessage,
} from './models/notificationMessage';
import { initOperators, associateOperator } from './models/operator';
import {
  initOperatorDevices,
  associateOperatorDevice,
} from './models/operatorDevice';
import { initPasswordReset } from './models/passwordReset';
import { initRiskLevels, associateRiskLevel } from './models/riskLevel';
import { initSessions } from './models/session';
import { initSigningToolDownload } from './models/signingToolDownload';
import { initSMSCHallenge } from './models/smsChallenge';
import { initSupportedZipCodes } from './models/supportedZipCodes';
import { initTestProviders } from './models/testProvider';
import { initTestRedeems } from './models/testRedeems';
import { initTraces, associateTrace } from './models/trace';
import { initTraceData, associateTraceDatum } from './models/traceData';
import {
  initTracingProcesses,
  associateTracingProcess,
} from './models/tracingProcess';
import { initUsers } from './models/users';
import { initUserTransfers } from './models/userTransfer';

const environment = config.util.getEnv('NODE_ENV');
const databaseConfig = dbConfig[environment as keyof typeof dbConfig];

export const database = new Sequelize({
  ...(databaseConfig as Partial<Options>),
  logging: (message, time) => logger.debug({ time, message }),
  logQueryParameters: false,
  benchmark: true,
  retry: {
    name: 'database',
    max: 60 * 2,
    backoffBase: 500,
    backoffExponent: 1,
    report: (_message: string, info: { $current: number }) => {
      if (info.$current === 1) return;
      logger.warn(`Trying to connect to database (try #${info.$current})`);
    },
    match: [ConnectionError, ConnectionRefusedError, ConnectionTimedOutError],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
});

const counter = new client.Counter({
  name: 'sequelize_table_creation_count',
  help: 'Total database rows created since process start.',
  labelNames: ['tableName'],
});

database.addHook('beforeCreate', instance => {
  counter.inc({
    tableName: instance.constructor.name,
  });
});

database.addHook('beforeBulkCreate', instances => {
  if (instances.length <= 0) return;
  counter.inc(
    {
      tableName: instances[0].constructor.name,
    },
    instances.length
  );
});

export const AdditionalDataSchema = initAdditionalDataSchemas(database);
export const BadgeGenerator = initBadgeGenerators(database);
export const BadgePublicKey = initBadgePublicKeys(database);
export const Challenge = initChallenges(database);
export const DailyPublicKey = initDailyPublicKeys(database);
export const DummyTrace = initDummyTraces(database);
export const EmailActivation = initEmailActivations(database);
export const EncryptedBadgePrivateKey = initEncryptedBadgePrivateKeys(database);
export const EncryptedDailyPrivateKey = initEncryptedDailyPrivateKeys(database);
export const FeatureFlag = initFeatureFlags(database);
export const HealthDepartment = initHealthDepartments(database);
export const HealthDepartmentAuditLog = initHealthDepartmentAuditLogs(database);
export const HealthDepartmentEmployee = initHealthDepartmentEmployees(database);
export const internalAccessUser = initInternalAccessUser(database);
export const IPAddressAllowList = initIPAddressAllowLists(database);
export const IPAddressBlockList = initIPAddressBlockList(database);
export const IPAddressDenyList = initIPAddressDenyLists(database);
export const Location = initLocations(database);
export const LocationGroup = initLocationGroups(database);
export const LocationTransfer = initLocationTransfers(database);
export const LocationTransferTrace = initLocationTransferTraces(database);
export const NotificationChunk = initNotificationChunks(database);
export const NotificationMessage = initNotificationMessages(database);
export const Operator = initOperators(database);
export const OperatorDevice = initOperatorDevices(database);
export const PasswordReset = initPasswordReset(database);
export const RiskLevel = initRiskLevels(database);
export const SigningToolDownload = initSigningToolDownload(database);
export const SMSChallenge = initSMSCHallenge(database);
export const SupportedZipCodes = initSupportedZipCodes(database);
export const TestProvider = initTestProviders(database);
export const TestRedeem = initTestRedeems(database);
export const Trace = initTraces(database);
export const TraceData = initTraceData(database);
export const TracingProcess = initTracingProcesses(database);
export const User = initUsers(database);
export const UserTransfer = initUserTransfers(database);
export const Session = initSessions(database);

const models = {
  AdditionalDataSchema,
  BadgeGenerator,
  BadgePublicKey,
  Challenge,
  DailyPublicKey,
  DummyTrace,
  EmailActivation,
  EncryptedBadgePrivateKey,
  EncryptedDailyPrivateKey,
  FeatureFlag,
  HealthDepartment,
  HealthDepartmentAuditLog,
  HealthDepartmentEmployee,
  IPAddressAllowList,
  IPAddressBlockList,
  IPAddressDenyList,
  Location,
  LocationGroup,
  LocationTransfer,
  LocationTransferTrace,
  NotificationChunk,
  NotificationMessage,
  Operator,
  OperatorDevice,
  PasswordReset,
  RiskLevel,
  Session,
  SigningToolDownload,
  SMSChallenge,
  SupportedZipCodes,
  TestProvider,
  TestRedeem,
  Trace,
  TraceData,
  TracingProcess,
  User,
  UserTransfer,
};

export type Models = typeof models;

associateAdditionalDataSchema(models);
associateDummyTrace(models);
associateEmailActivation(models);
associateHealthDepartment(models);
associateHealthDepartmentAuditLog(models);
associateHealthDepartmentEmployee(models);
associateLocation(models);
associateLocationGroup(models);
associateLocationTransfer(models);
associateLocationTransferTrace(models);
associateNotificationMessage(models);
associateOperator(models);
associateOperatorDevice(models);
associateRiskLevel(models);
associateTrace(models);
associateTraceDatum(models);
associateTracingProcess(models);

sequelizeStream(database);
