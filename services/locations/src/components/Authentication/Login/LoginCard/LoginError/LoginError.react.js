import React from 'react';
import { useIntl } from 'react-intl';

import { ErrorMessage } from './LoginError.styled';

export const LoginError = ({ error }) => {
  const intl = useIntl();

  return (
    <>
      {error && (
        <ErrorMessage data-cy="loginError">
          {intl.formatMessage({
            id: error.message,
          })}
        </ErrorMessage>
      )}
    </>
  );
};
