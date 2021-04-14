import React from 'react';
import { useIntl } from 'react-intl';

import { TERMS_CONDITIONS_LINK } from 'constants/links';

import { Link, LegalWrapper } from './Footer.styled';

export const Footer = () => {
  const intl = useIntl();
  return (
    <LegalWrapper>
      <Link href={TERMS_CONDITIONS_LINK} target="_blank">
        {intl.formatMessage({ id: 'authentication.background.legal.agb' })}
      </Link>
    </LegalWrapper>
  );
};
