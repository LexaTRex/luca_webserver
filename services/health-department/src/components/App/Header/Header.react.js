import React from 'react';
import { useIntl } from 'react-intl';

// Assets
import LucaLogo from 'assets/LucaLogo.svg';

// Components
import { LogoutButton } from './LogoutButton';
import { LinkMenu } from './LinkMenu';
import {
  HeaderWrapper,
  Logo,
  SubTitle,
  Title,
  MenuWrapper,
} from './Header.styled';

export const Header = ({ onlyLogo = false }) => {
  const intl = useIntl();
  return (
    <HeaderWrapper>
      <Title>
        <Logo src={LucaLogo} />
        <SubTitle>
          {intl.formatMessage({
            id: 'header.subtitle',
          })}
        </SubTitle>
      </Title>
      {!onlyLogo && (
        <MenuWrapper>
          <LinkMenu />
          <LogoutButton />
        </MenuWrapper>
      )}
    </HeaderWrapper>
  );
};
