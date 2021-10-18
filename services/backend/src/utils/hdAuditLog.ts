/* eslint-disable max-lines */
import config from 'config';
import database from 'database';
import moment from 'moment-timezone';
import { Transform } from 'stream';
import { AuditLogEvents, AuditStatusType } from 'constants/auditLog';
import type { TransformCallback } from 'stream';
import logger from './logger';

interface GenericEvent {
  type: AuditLogEvents;
  status: AuditStatusType;
  meta?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

interface ResetPasswordEvent extends GenericEvent {
  type: AuditLogEvents.RESET_PASSWORD;
  meta: {
    target: string; // employee UUID
  };
}
interface CreateEmployeeEvent extends GenericEvent {
  type: AuditLogEvents.CREATE_EMPLOYEE;
  meta: {
    target: string; // employee UUID
  };
}
interface ReactivateEmployeeEvent extends GenericEvent {
  type: AuditLogEvents.REACTIVATE_EMPLOYEE;
  meta: {
    target: string; // employee UUID
  };
}
interface UpdateEmployeeEvent extends GenericEvent {
  type: AuditLogEvents.UPDATE_EMPLOYEE;
  meta: {
    target: string; // employee UUID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributes: any; // changed Attributes
  };
}
interface DeleteEmployeeEvent extends GenericEvent {
  type: AuditLogEvents.DELETE_EMPLOYEE;
  meta: {
    target: string; // employee UUID
  };
}
interface ChangeRoleEvent extends GenericEvent {
  type: AuditLogEvents.CHANGE_ROLE;
  meta: {
    target: string; // employee UUID
    isAdmin: boolean;
  };
}
interface CreateTracingProcessEvent extends GenericEvent {
  type: AuditLogEvents.CREATE_TRACING_PROCESS;
  meta: {
    transferId: string;
    locationId?: string;
    viaTan?: boolean;
  };
}

interface RequestDataEvent extends GenericEvent {
  type: AuditLogEvents.REQUEST_DATA;
  meta: {
    processId: string;
    transferId: string;
    locationId: string;
    timeframe: string[];
    amountOfTraces: number;
  };
}

interface ReceiveDataEvent extends GenericEvent {
  type: AuditLogEvents.RECEIVE_DATA;
  meta: {
    processId: string;
    transferId: string;
    locationId: string;
    timeframe: string[];
    amountOfTraces: number;
  };
}

interface ViewDataEvent extends GenericEvent {
  type: AuditLogEvents.VIEW_DATA;
  meta: {
    processId: string;
    transferId: string;
    locationId: string;
    timeframe: string[];
    amountOfTraces: number;
  };
}

interface IssueDailyKeypairEvent extends GenericEvent {
  type: AuditLogEvents.ISSUE_DAILY_KEYPAIR;
  meta: {
    keyId: string;
  };
}
interface IssueBadgeKeypairEvent extends GenericEvent {
  type: AuditLogEvents.ISSUE_BADGE_KEYPAIR;
  meta: {
    keyId: string;
  };
}

interface RekeyDailyKeypairEvent extends GenericEvent {
  type: AuditLogEvents.REKEY_DAILY_KEYPAIR;
  meta: {
    newKeyId: string;
    oldKeyId?: string;
    oldKeyHd?: string;
  };
}

interface RekeyBadgeKeypairEvent extends GenericEvent {
  type: AuditLogEvents.REKEY_BADGE_KEYPAIR;
  meta: {
    newKeyId: string;
    oldKeyId?: string;
    oldKeyHd?: string;
  };
}

interface DownloadAuditLogEvent extends GenericEvent {
  type: AuditLogEvents.DOWNLOAD_AUDITLOG;
  meta: {
    timeframe: string[];
  };
}

export enum DownloadTracesType {
  CSV = 'csv',
  EXCEL = 'excel',
  SORMAS = 'sormas',
  OCTOWARE = 'octoware',
}

interface DownloadTracesEvent extends GenericEvent {
  type: AuditLogEvents.DOWNLOAD_TRACES;
  meta: {
    type: DownloadTracesType;
    transferId: string;
    amount: number;
  };
}

interface ExportTracesEvent extends GenericEvent {
  type: AuditLogEvents.DOWNLOAD_TRACES;
  meta: {
    transferId: string;
    amount: number;
  };
}

type LogEvent =
  | GenericEvent
  | RekeyBadgeKeypairEvent
  | RekeyDailyKeypairEvent
  | IssueBadgeKeypairEvent
  | IssueDailyKeypairEvent
  | ViewDataEvent
  | ReceiveDataEvent
  | RequestDataEvent
  | CreateTracingProcessEvent
  | DeleteEmployeeEvent
  | UpdateEmployeeEvent
  | CreateEmployeeEvent
  | ResetPasswordEvent
  | ChangeRoleEvent
  | DownloadAuditLogEvent
  | DownloadTracesEvent
  | ExportTracesEvent;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function logEvent(employee: any, event: LogEvent) {
  try {
    await database.HealthDepartmentAuditLog.create({
      departmentId: employee.departmentId,
      employeeId: employee.uuid,
      type: event.type,
      status: event.status,
      meta: event.meta,
    });
  } catch (error) {
    if (error instanceof Error) logger.error(error);
  }
}

export const toReadableDate = (date: string) => {
  return moment(date).tz(config.get('tz')).format('YYYY-MM-DD HH:mm:ss');
};

const getReadableDownloadFormat = (type: DownloadTracesType): string => {
  switch (type) {
    case DownloadTracesType.CSV:
      return 'als csv';
    case DownloadTracesType.EXCEL:
      return 'für Excel (xlsx)';
    case DownloadTracesType.SORMAS:
      return 'für SORMAS (csv)';
    case DownloadTracesType.OCTOWARE:
      return 'für OctoWareTN (xlsx)';
    default:
      return '';
  }
};

const MESSAGES = {
  [AuditLogEvents.LOGIN]: (_: GenericEvent) => ({
    [AuditStatusType.SUCCESS]: `hat sich angemeldet`,
    [AuditStatusType.ERROR_INVALID_PASSWORD]: `hat versucht sich anzumelden (Fehlgeschlagen: Passwort falsch)`,
  }),
  [AuditLogEvents.LOGOUT]: (_: GenericEvent) => ({
    [AuditStatusType.SUCCESS]: `hat sich abgemeldet`,
  }),
  [AuditLogEvents.CHANGE_PASSWORD]: (_: GenericEvent) => ({
    [AuditStatusType.SUCCESS]: `hat sein Password geändert`,
    [AuditStatusType.ERROR_INVALID_PASSWORD]: `hat versucht sein Passwort zu ändern (Fehlgeschlagen: Passwort falsch)`,
  }),
  [AuditLogEvents.RESET_PASSWORD]: (event: ResetPasswordEvent) => ({
    [AuditStatusType.SUCCESS]: `hat ein neues Passwort für ${event.meta.target} angefordert`,
    [AuditStatusType.ERROR_TARGET_NOT_FOUND]: `hat versucht ein neues Passwort für ${event.meta.target} anzufordern (Fehlgeschlagen: Nicht zugehörig zum gleichen GesundheitsGesundheitsamt)`,
  }),
  [AuditLogEvents.CREATE_EMPLOYEE]: (event: CreateEmployeeEvent) => ({
    [AuditStatusType.SUCCESS]: `hat ein neues Konto für ${event.meta.target} angelegt`,
  }),
  [AuditLogEvents.REACTIVATE_EMPLOYEE]: (event: ReactivateEmployeeEvent) => ({
    [AuditStatusType.SUCCESS]: `hat das Konto für ${event.meta.target} reaktiviert`,
  }),
  [AuditLogEvents.UPDATE_EMPLOYEE]: (event: UpdateEmployeeEvent) => ({
    [AuditStatusType.SUCCESS]: `hat die Attribute ${Object.keys(
      event.meta.attributes
    )} für das Mitarbeiterkonto ${event.meta.target} geändert.`,
    [AuditStatusType.ERROR_TARGET_NOT_FOUND]: `hat versucht Attribute für ein Mitarbeiterkonto zu ändern (Fehlgeschlagen: Mitarbeiterkonto nicht gefunden)`,
  }),
  [AuditLogEvents.DELETE_EMPLOYEE]: (event: DeleteEmployeeEvent) => ({
    [AuditStatusType.SUCCESS]: `hat das Mitarbeiterkonto ${event.meta.target} gelöscht.`,
    [AuditStatusType.ERROR_TARGET_NOT_FOUND]: `hat versucht ein Mitarbeiterkonto zu löschen (Fehlgeschlagen: Mitarbeiterkonto nicht gefunden)`,
  }),
  [AuditLogEvents.CHANGE_ROLE]: (event: ChangeRoleEvent) => ({
    [AuditStatusType.SUCCESS]: `hat die Rolle Administrator für ${
      event.meta.target
    } ${event.meta.isAdmin ? 'hinzugefügt' : 'entfernt'}.`,
  }),
  [AuditLogEvents.CREATE_TRACING_PROCESS]: (
    event: CreateTracingProcessEvent
  ) => ({
    [AuditStatusType.SUCCESS]: `hat einen Nachverfolgungsprozess ${
      event.meta?.viaTan ? 'via TAN ' : ''
    }erstellt: ${event.meta.transferId}`,
    [AuditStatusType.ERROR_TARGET_NOT_FOUND]: `hat versucht einen Nachverfolgungsprozess  ${
      event.meta?.viaTan ? 'via TAN ' : ''
    }zu erstellen (Fehlgeschlagen: Location ${
      event.meta.locationId
    } des Locations Transfers wurde nicht gefunden)`,
    [AuditStatusType.ERROR_LIMIT_EXCEEDED]: `hat versucht einen Nachverfolgungsprozess  ${
      event.meta?.viaTan ? 'via TAN ' : ''
    }zu erstellen (Fehlgeschlagen: Zu viele Locations)`,
    [AuditStatusType.ERROR_INVALID_USER]: `hat versucht einen Nachverfolgungsprozess via TAN zu erstellen (Fehlgeschlagen: Initiierter User Transfer nicht vorhanden)`,
  }),
  [AuditLogEvents.REQUEST_DATA]: (event: RequestDataEvent) => ({
    [AuditStatusType.SUCCESS]: `hat die Anfrage ${event.meta.transferId} an die Location ${event.meta.locationId} gestellt`,
  }),
  [AuditLogEvents.RECEIVE_DATA]: (event: ReceiveDataEvent) => ({
    [AuditStatusType.SUCCESS]: `hat die Freigabe ${event.meta.transferId} von der Location ${event.meta.locationId} erhalten`,
  }),
  [AuditLogEvents.VIEW_DATA]: (event: ViewDataEvent) => ({
    [AuditStatusType.SUCCESS]: `hat den Nachverfolgungsprozess ${event.meta.transferId} angesehen`,
    [AuditStatusType.ERROR_TARGET_NOT_FOUND]: `hat versucht den Nachverfolgungsprozess ${event.meta.transferId} anzusehen (Fehlgeschlagen: Prozess nicht gefunden)`,
  }),
  [AuditLogEvents.DOWNLOAD_AUDITLOG]: (event: DownloadAuditLogEvent) => ({
    [AuditStatusType.SUCCESS]: `hat einen Log heruntergeladen für den Zeitraum ${toReadableDate(
      event.meta.timeframe[1]
    )} - ${toReadableDate(event.meta.timeframe[0])}`,
  }),
  [AuditLogEvents.ISSUE_DAILY_KEYPAIR]: (event: IssueDailyKeypairEvent) => ({
    [AuditStatusType.SUCCESS]: `hat einen neuen daily Key ausgestellt ${event.meta.keyId}`,
    [AuditStatusType.ERROR_TIMEFRAME]: `hat versucht einen neuen daily Key auszustellen (Fehlgeschlagen: Differenz in der Zeit der Erstellung zu hoch)`,
    [AuditStatusType.ERROR_INVALID_SIGNATURE]: `hat versucht einen neuen daily Key auszustellen (Fehlgeschlagen: Signatur nicht korrekt)`,
    [AuditStatusType.ERROR_INVALID_KEYID]: `hat versucht einen neuen daily Key auszustellen (Fehlgeschlagen: KeyID nicht korrekt)`,
    [AuditStatusType.ERROR_LIMIT_EXCEEDED]: `hat versucht einen neuen daily Key auszustellen (Fehlgeschlagen: maximale Anzahl an täglichen Keys erreicht)`,
  }),
  [AuditLogEvents.ISSUE_BADGE_KEYPAIR]: (event: IssueBadgeKeypairEvent) => ({
    [AuditStatusType.SUCCESS]: `hat einen neuen Badge Key ausgestellt ${event.meta.keyId}`,
    [AuditStatusType.ERROR_TIMEFRAME]: `hat versucht einen neuen Badge Key auszustellen (Fehlgeschlagen: Differenz in der Zeit der Erstellung zu hoch)`,
    [AuditStatusType.ERROR_INVALID_SIGNATURE]: `hat versucht einen neuen Badge Key auszustellen (Fehlgeschlagen: Signatur nicht korrekt)`,
    [AuditStatusType.ERROR_INVALID_KEYID]: `hat versucht einen neuen Badge Key auszustellen (Fehlgeschlagen: KeyID nicht korrekt)`,
    [AuditStatusType.ERROR_LIMIT_EXCEEDED]: `hat versucht einen neuen Badge Key auszustellen (Fehlgeschlagen: maximale Anzahl an täglichen Badges erreicht)`,
  }),
  [AuditLogEvents.REKEY_DAILY_KEYPAIR]: (event: RekeyDailyKeypairEvent) => ({
    [AuditStatusType.SUCCESS]: `hat den Daily Key ${event.meta.oldKeyId} des Gesundheitsamtes ${event.meta.oldKeyHd} synchronisiert. (Neuer Daily Key: ${event.meta.newKeyId})`,
    [AuditStatusType.ERROR_CONFLICT_KEY]: `hat versucht die Daily Keys zu synchronisieren (Fehlgeschlagen: Key ist bereits der aktuelle)`,
    [AuditStatusType.ERROR_TARGET_NOT_FOUND]: `hat versucht die Daily Keys zu synchronisieren (Fehlgeschlagen: Daily Public Key nicht gefunden)`,
    [AuditStatusType.ERROR_INVALID_SIGNATURE]: `hat versucht die Daily Keys zu synchronisieren (Fehlgeschlagen: Signatur nicht korrekt)`,
  }),
  [AuditLogEvents.REKEY_BADGE_KEYPAIR]: (event: RekeyBadgeKeypairEvent) => ({
    [AuditStatusType.SUCCESS]: `hat den Badge Key ${event.meta.oldKeyId} des Gesundheitsamtes ${event.meta.oldKeyHd} synchronisiert. (Neuer Badge Key: ${event.meta.newKeyId})`,
    [AuditStatusType.ERROR_CONFLICT_KEY]: `hat versucht die Badge Keys zu synchronisieren (Fehlgeschlagen: Key ist bereits der aktuelle)`,
    [AuditStatusType.ERROR_TARGET_NOT_FOUND]: `hat versucht die Badge Keys zu synchronisieren (Fehlgeschlagen: Badge Public Key nicht gefunden)`,
    [AuditStatusType.ERROR_INVALID_SIGNATURE]: `hat versucht die Badge Keys zu synchronisieren (Fehlgeschlagen: Signatur nicht korrekt)`,
  }),
  [AuditLogEvents.DOWNLOAD_TRACES]: (event: DownloadTracesEvent) => ({
    [AuditStatusType.SUCCESS]: `hat für den Nachverfolgungsprozess ${
      event.meta.transferId
    } ${event.meta.amount} Traces ${getReadableDownloadFormat(
      event.meta.type
    )} heruntergeladen.`,
  }),
  [AuditLogEvents.EXPORT_TRACES]: (event: ExportTracesEvent) => ({
    [AuditStatusType.SUCCESS]: `hat für ${event.meta.transferId} ${event.meta.amount} Traces für SORMAS (Schnittstelle) exportiert.`,
  }),
};

export function toReadableEvent(event: LogEvent) {
  try {
    const eventLogTransformer = MESSAGES[event.type as keyof typeof MESSAGES];

    if (eventLogTransformer !== undefined) {
      const transformed = eventLogTransformer(event as never);

      const foundStatusTranslation =
        transformed[event.status as keyof typeof transformed];

      if (foundStatusTranslation) {
        return foundStatusTranslation;
      }
    }
  } catch (error) {
    if (error instanceof Error)
      logger.error(`Event not processable: ${error.message}`);
    return null;
  }

  return `Event: ${event.type} - Status ${event.status}`;
}

// any until models are typed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function entriesToPlainText(entries: any[]) {
  return `${entries
    .map(entry => {
      const readableEvent = toReadableEvent(entry);

      if (!readableEvent) {
        return null;
      }

      return `[${toReadableDate(entry.createdAt)}] ${
        entry.employeeId
      } ${readableEvent}`;
    })
    .filter(event => !!event)
    .join('\n')}\n`;
}

export class AuditLogTransformer extends Transform {
  // any until models are typed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _transform = (chunk: any[], _: any, done: TransformCallback) => {
    done(null, entriesToPlainText(chunk));
  };
}
