import { useIntl } from 'react-intl';
import { useCallback, useMemo } from 'react';

import {
  ALL_PROCESS_TYPES,
  ALL_PROCESS_STATUS,
  ALL_PROCESSES_STATES,
  OPEN_PROCESSES_STATUS,
  PERSON_PROCESSES_TYPE,
  LOCATION_PROCESSES_TYPE,
  APPROVED_PROCESSES_STATUS,
  COMPLETED_PROCESSES_STATE,
  REQUESTED_PROCESSES_STATUS,
  INCOMPLETED_PROCESSES_STATE,
  PARTIAL_APPROVED_PROCESSES_STATUS,
  PARTIAL_REQUESTED_PROCESSES_STATUS,
} from 'constants/filter';

export function useProcessTypeFilter(onChange = () => {}) {
  const intl = useIntl();
  return useMemo(
    () => ({
      onChange: value => onChange('type', value),
      title: intl.formatMessage({ id: 'sort.type.headline' }),
      options: [
        {
          value: ALL_PROCESS_TYPES,
          intl: intl.formatMessage({ id: 'sort.type.all' }),
        },
        {
          value: PERSON_PROCESSES_TYPE,
          intl: intl.formatMessage({ id: 'sort.type.person' }),
        },
        {
          value: LOCATION_PROCESSES_TYPE,
          intl: intl.formatMessage({ id: 'sort.type.location' }),
        },
      ],
    }),
    [intl, onChange]
  );
}
export function useProcessStateFilter(onChange = () => {}) {
  const intl = useIntl();
  return useMemo(
    () => ({
      onChange: value => onChange('state', value),
      title: intl.formatMessage({ id: 'sort.state.headline' }),
      options: [
        {
          value: ALL_PROCESSES_STATES,
          intl: intl.formatMessage({ id: 'sort.state.all' }),
        },
        {
          value: COMPLETED_PROCESSES_STATE,
          intl: intl.formatMessage({ id: 'sort.state.completed' }),
        },
        {
          value: INCOMPLETED_PROCESSES_STATE,
          intl: intl.formatMessage({ id: 'sort.state.incompleted' }),
        },
      ],
    }),
    [intl, onChange]
  );
}
export function useProcessStatusFilter(
  onChange = () => {},
  activeStatusFilters
) {
  const intl = useIntl();

  const onProcessStatusFilterChange = useCallback(
    (value, activeFilters) => {
      if (
        value.length === 2 &&
        activeFilters.length === 1 &&
        value.includes(ALL_PROCESS_STATUS) &&
        activeFilters.includes(ALL_PROCESS_STATUS)
      ) {
        onChange(
          'status',
          value.filter(filter => ALL_PROCESS_STATUS !== filter)
        );
        return;
      }

      if (
        value.length === 0 ||
        value.length === 5 ||
        (value.includes(ALL_PROCESS_STATUS) && value.length >= 2)
      ) {
        onChange('status', [ALL_PROCESS_STATUS]);
        return;
      }

      onChange('status', value);
    },
    [onChange]
  );

  const options = useMemo(
    () => [
      {
        value: ALL_PROCESS_STATUS,
        intl: intl.formatMessage({ id: 'sort.status.all' }),
      },
      {
        value: OPEN_PROCESSES_STATUS,
        intl: intl.formatMessage({ id: 'sort.status.open' }),
      },
      {
        value: PARTIAL_APPROVED_PROCESSES_STATUS,
        intl: intl.formatMessage({ id: 'sort.status.partlyApproved' }),
      },
      {
        value: APPROVED_PROCESSES_STATUS,
        intl: intl.formatMessage({ id: 'sort.status.approved' }),
      },
      {
        value: PARTIAL_REQUESTED_PROCESSES_STATUS,
        intl: intl.formatMessage({ id: 'sort.status.partlyRequested' }),
      },
      {
        value: REQUESTED_PROCESSES_STATUS,
        intl: intl.formatMessage({ id: 'sort.status.requested' }),
      },
    ],
    [intl]
  );

  return {
    options,
    title: intl.formatMessage({ id: 'sort.status.headline' }),
    onChange: value => onProcessStatusFilterChange(value, activeStatusFilters),
  };
}

export function useListFilters(filters, onChange = () => {}) {
  const onFilterChange = useCallback(
    (type, value) => {
      onChange({ ...filters, [type]: value });
    },
    [filters, onChange]
  );

  const type = useProcessTypeFilter(onFilterChange);
  const state = useProcessStateFilter(onFilterChange);
  const status = useProcessStatusFilter(onFilterChange, filters.status);

  return {
    type: { ...type, active: filters.type },
    state: { ...state, active: filters.state },
    status: { ...status, active: filters.status },
  };
}
