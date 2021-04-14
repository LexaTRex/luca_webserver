import React from 'react';
import { useIntl } from 'react-intl';

// Components
import { TableHeader } from './Header.styled';
import { Column } from '../Table.styled';

export const Header = () => {
  const intl = useIntl();

  return (
    <TableHeader>
      <Column flex="10%">
        {intl.formatMessage({ id: 'processTable.description' })}
      </Column>
      <Column flex="20%">
        {intl.formatMessage({ id: 'processTable.name' })}
      </Column>
      <Column flex="10%">
        {intl.formatMessage({ id: 'processTable.status' })}
      </Column>
      <Column flex="10%" />
      <Column flex="10%" />
    </TableHeader>
  );
};
