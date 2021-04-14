import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Alert } from 'antd';

import { getBadgeRegistrator } from 'network/api';

import { Header } from './Header';
import { RegisterForm } from './RegisterForm';
import { Wrapper } from './RegisterBadge.styled';

export const RegisterBadge = ({ requiresVerification }) => {
  const intl = useIntl();
  const title = intl.formatMessage({ id: 'registerBadge.site.title' });
  const meta = intl.formatMessage({ id: 'registerBadge.site.meta' });
  const { registratorId } = useParams();

  // If we have a registratorId in the url we need to check if the id is valid
  const { isLoading, error, data } = useQuery(
    'badgeRegistrator',
    () => getBadgeRegistrator(registratorId),
    { retry: false }
  );

  if (registratorId && isLoading) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={meta} />
      </Helmet>
      <Wrapper>
        <Header registrator={registratorId ? data : null} />
        {(error || data?.errors?.length) && registratorId ? (
          <Alert
            style={{ marginTop: 48, textAlign: 'center' }}
            message={intl.formatMessage({
              id: 'error.registerBadge.invalidRegistratorId',
            })}
            type="error"
          />
        ) : (
          <RegisterForm requiresVerification={requiresVerification} />
        )}
      </Wrapper>
    </>
  );
};
