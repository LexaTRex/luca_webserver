import React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { getVersion } from 'network/static';
import { TERMS_CONDITIONS_LINK, FAQ_LINK, GITLAB_LINK } from 'constants/links';

import { Link, Version, LegalWrapper } from './Footer.styled';

export const Footer = () => {
  const intl = useIntl();
  const { isSuccess, data: info } = useQuery('version', getVersion, {
    refetchOnWindowFocus: false,
  });

  return (
    <LegalWrapper>
      <Link href={FAQ_LINK} target="_blank" rel="noopener noreferrer">
        {intl.formatMessage({ id: 'location.footer.faq' })}
      </Link>
      <Link href={GITLAB_LINK} target="_blank" rel="noopener noreferrer">
        {intl.formatMessage({ id: 'location.footer.repository' })}
      </Link>
      <Link href={TERMS_CONDITIONS_LINK} target="_blank">
        {intl.formatMessage({ id: 'authentication.background.legal.agb' })}
      </Link>
      <Version>{isSuccess ? 'luca Locations' : ''}</Version>
      <Version title={isSuccess ? `(${info.version}#${info.commit})` : ''}>
        {isSuccess ? `(${info.version}#${info.commit})` : ''}
      </Version>
    </LegalWrapper>
  );
};
