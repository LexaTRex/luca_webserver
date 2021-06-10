import React from 'react';
import { useIntl } from 'react-intl';
import Icon from '@ant-design/icons';

import { ReactComponent as SearchSvg } from 'assets/search.svg';

import { StyledInput } from './EmployeeSearch.styled';

const SearchIcon = () => (
  <Icon component={SearchSvg} style={{ color: 'black' }} />
);

export const EmployeeSearch = ({ onSearch }) => {
  const intl = useIntl();

  const search = event => {
    onSearch(event.target.value);
  };
  return (
    <StyledInput
      id="employeeSearch"
      placeholder={intl.formatMessage({
        id: 'userManagement.search.placeholder',
      })}
      prefix={<SearchIcon />}
      onChange={search}
    />
  );
};
