import React from 'react';

// Components
import { LogoutButton } from './LogoutButton';
import { LinkMenu } from './LinkMenu';
import { Profile } from './Profile';
import { Headline } from './Headline';
import { HeaderWrapper, MenuWrapper } from './Header.styled';

export const Header = ({ onlyLogo = false }) => {
  return (
    <HeaderWrapper>
      <Headline onlyLogo={onlyLogo} data-testid="header-headline" />
      {!onlyLogo && (
        <MenuWrapper data-testid="header-menu-wrapper">
          <Profile />
          <LinkMenu />
          <LogoutButton />
        </MenuWrapper>
      )}
    </HeaderWrapper>
  );
};
