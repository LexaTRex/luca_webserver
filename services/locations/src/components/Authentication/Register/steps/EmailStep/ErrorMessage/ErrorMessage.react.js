import React from 'react';
import { useIntl } from 'react-intl';

import { Error } from './ErrorMessage.styled';

export const ErrorMessage = ({ emailExists }) => {
  const intl = useIntl();
  return (
    <>
      {emailExists && (
        <Error>
          {intl.formatMessage({ id: 'authentication.register.emailInUse' })}
        </Error>
      )}
    </>
  );
};
