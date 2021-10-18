import { E2E_TRACE_ID } from '../utils/payloads.helper';
import { E2E_EMAIL } from './users';
import { NEW_E2E_EMAIL } from '../authentication/authentication.helper';

export const DELETE_E2E_TRACE_QUERY = `DELETE FROM "Traces" WHERE "traceId"='${E2E_TRACE_ID}'`;
export const RESET_LOCATION_KEY_QUERY = `UPDATE "Operators" SET "publicKey" = NULL WHERE "email"='${E2E_EMAIL}'`;

export const DELETE_UNKOWN_OPERATOR = `DELETE FROM "Operators" WHERE "email"='${NEW_E2E_EMAIL}'`;
