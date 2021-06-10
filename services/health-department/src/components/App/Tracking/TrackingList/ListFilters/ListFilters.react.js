import React from 'react';
import { useIntl } from 'react-intl';

import {
  getProcessStateOptions,
  getProcessStatusOptions,
  getProcessTypeOptions,
  getProcessAssigneeOptions,
} from './hooks/filterHelpers';

import { useListFilters, useGetAssigneeNameOptions } from './hooks/useFilters';

import { Filter } from './Filter';
import { StyledContainer } from './ListFilters.styled';

export function ListFilters({ filters, onChange = () => {} }) {
  const intl = useIntl();

  const typeOptions = getProcessTypeOptions(intl);
  const stateOptions = getProcessStateOptions(intl);
  const statusOptions = getProcessStatusOptions(intl);
  const basicAssigneeOptions = getProcessAssigneeOptions(intl);
  const assigneeOptions = [
    ...basicAssigneeOptions,
    ...useGetAssigneeNameOptions(),
  ];

  const { type } = useListFilters(filters, onChange, 'type', typeOptions);
  const { state } = useListFilters(filters, onChange, 'state', stateOptions);
  const { status } = useListFilters(filters, onChange, 'status', statusOptions);
  const { assignee } = useListFilters(
    filters,
    onChange,
    'assignee',
    assigneeOptions
  );

  return (
    <StyledContainer>
      <Filter
        title={state.title}
        active={state.active}
        options={state.options}
        onChange={state.onChange}
      />
      <Filter
        title={status.title}
        active={status.active}
        options={status.options}
        onChange={status.onChange}
        mode={status.mode}
      />
      <Filter
        title={type.title}
        active={type.active}
        options={type.options}
        onChange={type.onChange}
      />
      <Filter
        title={assignee.title}
        active={assignee.active}
        options={assignee.options}
        onChange={assignee.onChange}
        showSearch={assignee.showSearch}
        optionFilterProp={assignee.optionFilterProp}
        filterOption={assignee.filterOption}
        mode={assignee.mode}
      />
    </StyledContainer>
  );
}
