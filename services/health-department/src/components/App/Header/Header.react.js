import React from 'react';
import { useQuery } from 'react-query';
import { getHealthDepartment } from 'network/api';

// Components
import { Profile } from './Profile';
import { LinkMenu } from './LinkMenu';
import { Headline } from './Headline';
import { HelpCenter } from './HelpCenter';
import { LogoutButton } from './LogoutButton';
import { HeaderWrapper, MenuWrapper } from './Header.styled';

export const Header = ({ profileData }) => {
  const { data: healthDepartment, isLoading } = useQuery(
    'healthDepartment',
    () => getHealthDepartment(profileData.departmentId)
  );

  if (isLoading) {
    return null;
  }

  return (
    <HeaderWrapper data-cy="header">
      <Headline data-cy="header-headline" />
      <MenuWrapper data-cy="header-menu-wrapper">
        <Profile healthDepartment={healthDepartment} />
        <HelpCenter />
        <LinkMenu />
        <LogoutButton />
      </MenuWrapper>
    </HeaderWrapper>
  );
};
