import React from 'react';
import { useIntl } from 'react-intl';

// Components
import { TableHeader } from './Header.styled';
import { Column } from '../Table.styled';

export const Header = () => {
  const intl = useIntl();

  return (
    <TableHeader>
      <Column flex="15%">
        {intl.formatMessage({ id: 'processTable.description' })}
      </Column>
      <Column flex="25%">
        {intl.formatMessage({ id: 'processTable.name' })}
      </Column>
      <Column flex="15%">
        {intl.formatMessage({ id: 'processTable.createdAt' })}
      </Column>
      <Column flex="10%">
        {intl.formatMessage({ id: 'processTable.status' })}
      </Column>
      <Column flex="15%" />
      <Column flex="20%" />
    </TableHeader>
  );
};
