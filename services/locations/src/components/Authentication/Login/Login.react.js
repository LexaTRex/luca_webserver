import React from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet-async';

import { IS_MOBILE } from 'constants/environment';

import { Background } from '../Background';
import { Footer } from '../Footer';

import { Wrapper, AuthenticationWrapper } from '../Authentication.styled';
import { LoginCard } from './LoginCard';

export const Login = () => {
  const intl = useIntl();

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'locations.site.title' })}</title>
        <meta
          name="description"
          content={intl.formatMessage({ id: 'locations.site.meta' })}
        />
      </Helmet>
      <Wrapper id={IS_MOBILE ? 'isMobile' : ''}>
        <Background />
        <AuthenticationWrapper id="noSteps">
          <LoginCard />
          <Footer />
        </AuthenticationWrapper>
      </Wrapper>
    </>
  );
};
