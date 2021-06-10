import {
  ALL_PROCESSES_STATES,
  COMPLETED_PROCESSES_STATE,
  INCOMPLETED_PROCESSES_STATE,
  ALL_PROCESS_STATUS,
  OPEN_PROCESSES_STATUS,
  APPROVED_PROCESSES_STATUS,
  REQUESTED_PROCESSES_STATUS,
  PARTIAL_APPROVED_PROCESSES_STATUS,
  PARTIAL_REQUESTED_PROCESSES_STATUS,
  ALL_PROCESS_TYPES,
  PERSON_PROCESSES_TYPE,
  LOCATION_PROCESSES_TYPE,
  ALL_PROCESS_ASSIGNEE,
  PROCESSES_NO_ASSIGNEE,
} from 'constants/filters';

export const getProcessStateOptions = intl => [
  {
    value: ALL_PROCESSES_STATES,
    name: intl.formatMessage({ id: 'sort.type.all' }),
  },
  {
    value: COMPLETED_PROCESSES_STATE,
    name: intl.formatMessage({ id: 'sort.state.completed' }),
  },
  {
    value: INCOMPLETED_PROCESSES_STATE,
    name: intl.formatMessage({ id: 'sort.state.incompleted' }),
  },
];

export const getProcessStatusOptions = intl => [
  {
    value: ALL_PROCESS_STATUS,
    name: intl.formatMessage({ id: 'sort.status.all' }),
  },
  {
    value: OPEN_PROCESSES_STATUS,
    name: intl.formatMessage({ id: 'sort.status.open' }),
  },
  {
    value: APPROVED_PROCESSES_STATUS,
    name: intl.formatMessage({ id: 'sort.status.approved' }),
  },
  {
    value: REQUESTED_PROCESSES_STATUS,
    name: intl.formatMessage({ id: 'sort.status.requested' }),
  },
  {
    value: PARTIAL_APPROVED_PROCESSES_STATUS,
    name: intl.formatMessage({ id: 'sort.status.partlyApproved' }),
  },
  {
    value: PARTIAL_REQUESTED_PROCESSES_STATUS,
    name: intl.formatMessage({ id: 'sort.status.partlyRequested' }),
  },
];

export const getProcessTypeOptions = intl => [
  {
    value: ALL_PROCESS_TYPES,
    name: intl.formatMessage({ id: 'sort.type.all' }),
  },
  {
    value: PERSON_PROCESSES_TYPE,
    name: intl.formatMessage({ id: 'sort.type.person' }),
  },
  {
    value: LOCATION_PROCESSES_TYPE,
    name: intl.formatMessage({ id: 'sort.type.location' }),
  },
];

export const getProcessAssigneeOptions = intl => [
  {
    value: ALL_PROCESS_ASSIGNEE,
    name: intl.formatMessage({ id: 'sort.assignee.all' }),
  },
  {
    value: PROCESSES_NO_ASSIGNEE,
    name: intl.formatMessage({ id: 'sort.assignee.no' }),
  },
];

export const isAllStatusSelected = (value, activeFilters) => {
  return (
    value.length === 2 &&
    activeFilters.length === 1 &&
    value.includes(ALL_PROCESS_STATUS) &&
    activeFilters.includes(ALL_PROCESS_STATUS)
  );
};

export const isNoStatusSelected = (value, options) => {
  return (
    value.length === 0 ||
    value.length === options.length ||
    (value.includes(ALL_PROCESS_STATUS) && value.length >= 2)
  );
};

export const isAllAssigneeSelected = (value, activeFilters) => {
  return (
    value.length === 2 &&
    activeFilters.length === 1 &&
    value.includes(ALL_PROCESS_ASSIGNEE) &&
    activeFilters.includes(ALL_PROCESS_ASSIGNEE)
  );
};

export const isNoOrAllOptionsSelected = value => {
  return (
    value.length === 0 ||
    (value.includes(ALL_PROCESS_ASSIGNEE) && value.length >= 2)
  );
};
