import React from 'react';

import { VersionFooter } from 'components/App/VersionFooter';
import { EmployeeList } from './EmployeeList';
import { Wrapper, VersionFooterWrapper } from './UserManagement.styled';

export const UserManagement = ({ profileData }) => {
  return (
    <Wrapper>
      <EmployeeList profileData={profileData} />
      <VersionFooterWrapper>
        <VersionFooter />
      </VersionFooterWrapper>
    </Wrapper>
  );
};
