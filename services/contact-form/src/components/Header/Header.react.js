import React from 'react';

// Assets
import LucaLogo from 'assets/LucaLogo.svg';

// Components
import { HeaderWrapper, Logo } from './Header.styled';

export const Header = () => {
  return (
    <HeaderWrapper>
      <Logo src={LucaLogo} />
    </HeaderWrapper>
  );
};
