import React from 'react';

import { EmployeeList } from './EmployeeList';
import { Wrapper } from './UserManagement.styled';

export const UserManagement = () => {
  return (
    <Wrapper>
      <EmployeeList />
    </Wrapper>
  );
};
