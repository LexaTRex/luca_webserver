import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { getMe } from 'network/api';

import { LocationFooter } from 'components/App/LocationFooter';
import { Header } from './Header';

import { RegisterForm } from './RegisterForm';
import { Wrapper } from './RegisterBadge.styled';

export const RegisterBadge = () => {
  const intl = useIntl();
  const title = intl.formatMessage({ id: 'registerBadge.site.title' });
  const meta = intl.formatMessage({ id: 'registerBadge.site.meta' });

  const { isLoading, error, data: operator } = useQuery('me', () => getMe(), {
    retry: false,
  });

  if (isLoading) return null;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={meta} />
      </Helmet>
      <Wrapper>
        <Header registrator={operator} />
        <RegisterForm requiresVerification={!!error || !operator?.isTrusted} />
        <LocationFooter
          title={intl.formatMessage({
            id: 'header.registerBadge.subtitle',
          })}
          showBadgePrivacy
        />
      </Wrapper>
    </>
  );
};
