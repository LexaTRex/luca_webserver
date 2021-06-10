import { useCallback } from 'react';

import {
  PERSON_PROCESSES_TYPE,
  LOCATION_PROCESSES_TYPE,
  APPROVED_PROCESSES_STATUS,
  COMPLETED_PROCESSES_STATE,
  REQUESTED_PROCESSES_STATUS,
  INCOMPLETED_PROCESSES_STATE,
  ALL_PROCESS_ASSIGNEE,
  PROCESSES_NO_ASSIGNEE,
  ALL_PROCESS_STATUS,
  OPEN_PROCESSES_STATUS,
  PARTIAL_REQUESTED_PROCESSES_STATUS,
  PARTIAL_APPROVED_PROCESSES_STATUS,
} from 'constants/filters';

import { TRACE_PROCESSES_STATUS_TYPES } from 'constants/traceProcesses';
import { sort } from '../../Table/useSort';

function filterByAssignee(sortedProcesses, filters, sorting, processNames) {
  const getProcessWithAssignees = allProcesses => {
    return allProcesses.filter(process =>
      process.assignee
        ? filters.assignee.includes(process.assignee.uuid)
        : false
    );
  };

  const getProcessWithoutAssignees = allProcesses => {
    return allProcesses.filter(process => !process.assignee);
  };

  if (filters.assignee.includes(ALL_PROCESS_ASSIGNEE)) return sortedProcesses;

  if (filters.assignee.includes(PROCESSES_NO_ASSIGNEE)) {
    const onlyNoAssignee = filters.assignee.length === 1;
    return onlyNoAssignee
      ? getProcessWithoutAssignees(sortedProcesses)
      : sort(
          [
            ...getProcessWithAssignees(sortedProcesses),
            ...getProcessWithoutAssignees(sortedProcesses),
          ],
          sorting,
          processNames
        );
  }
  return getProcessWithAssignees(sortedProcesses);
}

function filterByStatus(sortedProcesses, filters) {
  if (filters.status.includes(ALL_PROCESS_STATUS)) {
    return sortedProcesses;
  }

  return sortedProcesses.filter(process => {
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

function filterByType(sortedProcesses, filters) {
  switch (filters.type) {
    case PERSON_PROCESSES_TYPE: {
      return sortedProcesses.filter(process => process.userTransferId !== null);
    }
    case LOCATION_PROCESSES_TYPE: {
      return sortedProcesses.filter(process => process.userTransferId === null);
    }
    default:
      return sortedProcesses;
  }
}

function filterByState(sortedProcesses, filters) {
  switch (filters.state) {
    case COMPLETED_PROCESSES_STATE: {
      return sortedProcesses.filter(process => process.isCompleted);
    }
    case INCOMPLETED_PROCESSES_STATE: {
      return sortedProcesses.filter(process => !process.isCompleted);
    }
    default:
      return sortedProcesses;
  }
}

export function useFilterSorter(filters, sorting) {
  return useCallback(
    (processesToFilter, processNames) => {
      const sortedProcesses = sort(processesToFilter, sorting, processNames);

      const filteredByType = filterByType(sortedProcesses, filters);

      const filteredByTypeAndState = filterByState(filteredByType, filters);

      const filteredByTypeStateStatus = filterByStatus(
        filteredByTypeAndState,
        filters
      );

      return filterByAssignee(
        filteredByTypeStateStatus,
        filters,
        sorting,
        processNames
      );
    },
    [filters, sorting]
  );
}
