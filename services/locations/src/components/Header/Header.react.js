import React from 'react';

// Components
import LucaLogoWhite from 'assets/LucaLogoWhite.svg';
import { SubTitle, HeaderWrapper, Logo } from './Header.styled';

// Assets

const HeaderRaw = ({ title }) => {
  return (
    <HeaderWrapper>
      <Logo src={LucaLogoWhite} />
      <SubTitle>{title}</SubTitle>
    </HeaderWrapper>
  );
};

export const Header = React.memo(HeaderRaw);
