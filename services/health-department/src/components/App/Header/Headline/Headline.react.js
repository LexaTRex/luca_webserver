import React from 'react';
import { useIntl } from 'react-intl';

// Assets
import LucaLogo from 'assets/LucaLogo.svg';

import { VerificationTag } from 'components/App/VerificationTag';
import { Logo, SubTitle, Title, VerificationWrapper } from './Headline.styled';

export const Headline = ({ onlyLogo }) => {
  const intl = useIntl();
  return (
    <Title>
      <Logo src={LucaLogo} />
      <SubTitle>
        {intl.formatMessage({
          id: 'header.subtitle',
        })}
      </SubTitle>
      {!onlyLogo && (
        <VerificationWrapper data-cy="headline-verification-tag">
          <VerificationTag />
        </VerificationWrapper>
      )}
    </Title>
  );
};
