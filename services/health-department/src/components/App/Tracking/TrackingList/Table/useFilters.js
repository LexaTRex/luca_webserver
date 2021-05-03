import { useCallback } from 'react';

import {
  PERSON_PROCESSES_TYPE,
  LOCATION_PROCESSES_TYPE,
  APPROVED_PROCESSES_STATUS,
  COMPLETED_PROCESSES_STATE,
  REQUESTED_PROCESSES_STATUS,
  INCOMPLETED_PROCESSES_STATE,
  ALL_PROCESS_STATUS,
  OPEN_PROCESSES_STATUS,
  PARTIAL_REQUESTED_PROCESSES_STATUS,
  PARTIAL_APPROVED_PROCESSES_STATUS,
} from 'constants/filter';
import { TIME_DOWN } from 'constants/sorting';
import { TRACE_PROCESSES_STATUS_TYPES } from 'constants/traceProcesses';

export const sort = (elementsToSort, sorting) => {
  switch (sorting) {
    case TIME_DOWN:
      return elementsToSort.sort((a, b) => b.createdAt - a.createdAt);
    default:
      return elementsToSort;
  }
};

export function useFilters(filters, sorting) {
  return useCallback(
    processesToFilter => {
      let sortedProcesses = sort(processesToFilter, sorting);

      // eslint-disable-next-line default-case
      switch (filters.type) {
        case PERSON_PROCESSES_TYPE: {
          sortedProcesses = sortedProcesses.filter(
            process => process.userTransferId !== null
          );
          break;
        }
        case LOCATION_PROCESSES_TYPE: {
          sortedProcesses = sortedProcesses.filter(
            process => process.userTransferId === null
          );
          break;
        }
      }

      // eslint-disable-next-line default-case
      switch (filters.state) {
        case COMPLETED_PROCESSES_STATE: {
          sortedProcesses = sortedProcesses.filter(
            process => process.isCompleted
          );
          break;
        }
        case INCOMPLETED_PROCESSES_STATE: {
          sortedProcesses = sortedProcesses.filter(
            process => !process.isCompleted
          );
          break;
        }
      }

      if (!filters.status.includes(ALL_PROCESS_STATUS)) {
        sortedProcesses = sortedProcesses.filter(process => {
          if (
            filters.status.includes(OPEN_PROCESSES_STATUS) &&
            process.status === TRACE_PROCESSES_STATUS_TYPES.NONE
          ) {
            return true;
          }

          if (
            filters.status.includes(PARTIAL_APPROVED_PROCESSES_STATUS) &&
            process.status === TRACE_PROCESSES_STATUS_TYPES.PARTIAL
          ) {
            return true;
          }

          if (
            filters.status.includes(APPROVED_PROCESSES_STATUS) &&
            process.status === TRACE_PROCESSES_STATUS_TYPES.ALL
          ) {
            return true;
          }

          if (
            filters.status.includes(PARTIAL_REQUESTED_PROCESSES_STATUS) &&
            process.status === TRACE_PROCESSES_STATUS_TYPES.REQUEST_PARTIAL
          ) {
            return true;
          }

          return (
            filters.status.includes(REQUESTED_PROCESSES_STATUS) &&
            process.status === TRACE_PROCESSES_STATUS_TYPES.REQUESTED
          );
        });
      }

      return sortedProcesses;
    },
    [filters, sorting]
  );
}
