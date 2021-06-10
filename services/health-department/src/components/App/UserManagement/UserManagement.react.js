import React from 'react';

import { EmployeeList } from './EmployeeList';
import { Wrapper } from './UserManagement.styled';

export const UserManagement = ({ profileData }) => {
  return (
    <Wrapper>
      <EmployeeList profileData={profileData} />
    </Wrapper>
  );
};
