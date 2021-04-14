import React from 'react';
import { useIntl } from 'react-intl';

// Assets
import LucaLogo from 'assets/LucaLogo.svg';

// Components
import { LicenseLink } from 'components/LicenseLink';
import { HeaderWrapper, Logo, Title, SubTitle } from './Header.styled';

export const Header = () => {
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
      <LicenseLink />
    </HeaderWrapper>
  );
};
