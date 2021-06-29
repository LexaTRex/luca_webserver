import React from 'react';
import { useIntl } from 'react-intl';

// Assets
import LucaLogo from 'assets/LucaLogo.svg';

// Components
import {
  HeaderWrapper,
  Logo,
  SubTitle,
  Title,
  RegistratorTitle,
} from './Header.styled';

export const Header = ({ registrator }) => {
  const intl = useIntl();
  return (
    <HeaderWrapper>
      <Title>
        <Logo src={LucaLogo} />
        <SubTitle>
          {intl.formatMessage({
            id: 'header.registerBadge.subtitle',
          })}
        </SubTitle>
      </Title>
      {registrator?.isTrusted && (
        <RegistratorTitle>
          {intl.formatMessage(
            { id: 'registerBadge.serialNumber.registrator' },
            { name: `${registrator.firstName} ${registrator.lastName}` }
          )}
        </RegistratorTitle>
      )}
    </HeaderWrapper>
  );
};
