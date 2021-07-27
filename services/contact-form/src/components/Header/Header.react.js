import React from 'react';

// Assets
import LucaLogo from 'assets/LucaLogo.svg';

// Components
import { Wrapper, HeaderWrapper, Logo, LinksWrapper } from './Header.styled';
import { LicenseLink } from './LicenseLink';
import { VersionLink } from './VersionLink';
import { GitlabLink } from './GitlabLink';

export const Header = () => {
  return (
    <Wrapper>
      <HeaderWrapper>
        <Logo src={LucaLogo} />
      </HeaderWrapper>
      <LinksWrapper>
        <LicenseLink />
        <VersionLink />
        <GitlabLink />
      </LinksWrapper>
    </Wrapper>
  );
};
