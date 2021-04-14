import React from 'react';
import { useIntl } from 'react-intl';
import { Alert } from 'antd';

import { Wrapper, ErrorCard } from './ErrorPage.styled';

export const ErrorPage = () => {
  const intl = useIntl();

  return (
    <Wrapper>
      <ErrorCard>
        <Alert
          type="error"
          message={intl.formatMessage({ id: 'error.getScannerWrapper' })}
        />
      </ErrorCard>
    </Wrapper>
  );
};
