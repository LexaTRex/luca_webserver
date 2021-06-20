import React from 'react';
import { useIntl } from 'react-intl';

import { TIME_DESC, TIME_ASC, NAME_DESC, NAME_ASC } from 'constants/sorting';

// Components
import { TableHeader } from './Header.styled';
import { SortingSelector } from './SortingSelector';
import { Column } from '../Table.styled';

export const Header = ({ setSorting, sorting }) => {
  const intl = useIntl();

  const toggleTimeSorting = () => {
    setSorting(sorting === TIME_DESC ? TIME_ASC : TIME_DESC);
  };

  const toggleNameSorting = () => {
    setSorting(sorting === NAME_DESC ? NAME_ASC : NAME_DESC);
  };

  return (
    <TableHeader>
      <Column flex="10%">
        {intl.formatMessage({ id: 'processTable.description' })}
      </Column>
      <Column flex="20%">
        {intl.formatMessage({ id: 'processTable.name' })}
        <SortingSelector onClick={() => toggleNameSorting()} />
      </Column>
      <Column flex="15%">
        {intl.formatMessage({ id: 'processTable.createdAt' })}
        <SortingSelector onClick={() => toggleTimeSorting()} />
      </Column>
      <Column flex="20%">
        {intl.formatMessage({ id: 'processTable.assignee' })}
      </Column>
      <Column flex="10%">
        {intl.formatMessage({ id: 'processTable.status' })}
      </Column>
    </TableHeader>
  );
};
