import React from 'react';

import { Filter } from './Filter';
import { useListFilters } from './filters';
import { StyledContainer } from './ListFilters.styled';

export function ListFilters({ filters, onChange = () => {} }) {
  const { type, state, status } = useListFilters(filters, onChange);

  return (
    <StyledContainer>
      <Filter
        title={state.title}
        active={state.active}
        options={state.options}
        onChange={state.onChange}
      />
      <Filter
        multiple
        title={status.title}
        active={status.active}
        options={status.options}
        onChange={status.onChange}
      />
      <Filter
        title={type.title}
        active={type.active}
        options={type.options}
        onChange={type.onChange}
      />
    </StyledContainer>
  );
}
