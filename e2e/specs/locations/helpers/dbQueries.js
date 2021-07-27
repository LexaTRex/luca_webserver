import { E2E_TRACE_ID } from './functions.helper';
import { E2E_EMAIL } from '../helpers/users';

export const DELETE_E2E_TRACE_QUERY = `DELETE FROM "Traces" WHERE "traceId"='${E2E_TRACE_ID}'`;
export const RESET_LOCATION_KEY_QUERY = `UPDATE "Operators" SET "publicKey" = NULL WHERE "email"='${E2E_EMAIL}'`;
