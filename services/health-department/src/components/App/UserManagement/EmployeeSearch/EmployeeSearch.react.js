import React from 'react';
import { useIntl } from 'react-intl';
import { Input } from 'antd';

export const EmployeeSearch = ({ onSearch }) => {
  const intl = useIntl();

  const search = event => {
    onSearch(event.target.value);
  };
  return (
    <Input
      id="noBorder"
      placeholder={intl.formatMessage({
        id: 'userManagement.search.placeholder',
      })}
      onChange={search}
      style={{
        width: '50%',
        margin: '0 0 24px 0',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
      }}
    />
  );
};
