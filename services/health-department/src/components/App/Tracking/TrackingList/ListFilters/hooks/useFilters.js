import { useIntl } from 'react-intl';
import { useCallback, useMemo } from 'react';

import { ALL_PROCESS_STATUS, ALL_PROCESS_ASSIGNEE } from 'constants/filters';

import {
  isAllStatusSelected,
  isNoStatusSelected,
  isAllAssigneeSelected,
  isNoOrAllOptionsSelected,
} from './filterHelpers';

// type and state
export function useGetFilters(onChange = () => {}, filterName, options) {
  const intl = useIntl();

  return useMemo(
    () => ({
      onChange: value => onChange(filterName, value),
      title: intl.formatMessage({ id: `sort.${filterName}.headline` }),
      options,
    }),
    [intl, onChange, filterName, options]
  );
}

// status
export function useGetStatusFilter(
  onChange = () => {},
  options,
  activeStatusFilters
) {
  const intl = useIntl();
  const onProcessStatusFilterChange = useCallback(
    (value, activeFilters) => {
      if (isAllStatusSelected(value, activeFilters)) {
        onChange(
          'status',
          value.filter(filter => ALL_PROCESS_STATUS !== filter)
        );
        return;
      }

      if (isNoStatusSelected(value, options)) {
        onChange('status', [ALL_PROCESS_STATUS]);
        return;
      }

      onChange('status', value);
    },
    [onChange, options]
  );
  return {
    options,
    title: intl.formatMessage({ id: 'sort.status.headline' }),
    onChange: value => onProcessStatusFilterChange(value, activeStatusFilters),
    mode: 'multiple',
  };
}

// assignee
export function useGetAssigneeFilter(
  onChange = () => {},
  options,
  activeAssigneeFilters
) {
  const intl = useIntl();
  const onProcessAssigneeFilterChange = useCallback(
    (value, activeFilters) => {
      if (isAllAssigneeSelected(value, activeFilters)) {
        onChange(
          'assignee',
          value.filter(filter => ALL_PROCESS_ASSIGNEE !== filter)
        );
        return;
      }

      if (isNoOrAllOptionsSelected(value)) {
        onChange('assignee', [ALL_PROCESS_ASSIGNEE]);
        return;
      }

      onChange('assignee', value);
    },
    [onChange]
  );
  return {
    options,
    title: intl.formatMessage({ id: 'sort.assignee.headline' }),
    onChange: value =>
      onProcessAssigneeFilterChange(value, activeAssigneeFilters),
    mode: 'multiple',
    optionFilterProp: 'key',
    filterOption: (input, option) =>
      option.key.toLowerCase().includes(input.toLowerCase()),
    showSearch: true,
  };
}

export function useListFilters(
  filters,
  onChange = () => {},
  filterName,
  filterOptions
) {
  const onFilterChange = useCallback(
    (type, value) => {
      onChange({ ...filters, [type]: value });
    },
    [filters, onChange]
  );

  const type = useGetFilters(onFilterChange, filterName, filterOptions);
  const state = useGetFilters(onFilterChange, filterName, filterOptions);
  const status = useGetStatusFilter(
    onFilterChange,
    filterOptions,
    filters.status
  );
  const assignee = useGetAssigneeFilter(
    onFilterChange,
    filterOptions,
    filters.assignee
  );

  return {
    type: { ...type, active: filters.type },
    state: { ...state, active: filters.state },
    status: { ...status, active: filters.status },
    assignee: { ...assignee, active: filters.assignee },
  };
}
