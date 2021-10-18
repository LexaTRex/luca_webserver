import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

// Constants
import { FORGOT_PASSWORD_ROUTE } from 'constants/routes';

import { ForgotPasswordLinkWrapper } from './ForgotPasswordLink.styled';

export const ForgotPasswordLink = () => {
  const intl = useIntl();

  return (
    <ForgotPasswordLinkWrapper>
      <Link
        to={{ pathname: FORGOT_PASSWORD_ROUTE }}
        data-cy="forgotPasswordLink"
      >
        {intl.formatMessage({ id: 'login.error.forgotPassword' })}
      </Link>
    </ForgotPasswordLinkWrapper>
  );
};
