import React from 'react';

// Components
import LucaLogoWhite from 'assets/LucaLogoWhite.svg';
import {
  SubTitle,
  HeaderWrapper,
  Logo,
  ActionsRow,
  LogoWrapper,
} from './Header.styled';

// Assets

const HeaderRaw = ({ title, actions }) => {
  return (
    <HeaderWrapper>
      <LogoWrapper>
        <Logo src={LucaLogoWhite} />
        <SubTitle>{title}</SubTitle>
      </LogoWrapper>
      {actions && <ActionsRow>{actions}</ActionsRow>}
    </HeaderWrapper>
  );
};

export const Header = React.memo(HeaderRaw);
