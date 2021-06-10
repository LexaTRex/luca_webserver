import React from 'react';
import { useIntl } from 'react-intl';
import { Alert } from 'antd';

import { Header } from 'components/Header';
import { AccountDeletedError } from 'network/api';
import { Wrapper, ErrorCard } from './ErrorPage.styled';

export const ErrorPage = ({ error }) => {
  const intl = useIntl();

  const messageId =
    error instanceof AccountDeletedError
      ? 'error.accountDeleted'
      : 'error.getScannerWrapper';

  const message = intl.formatMessage({ id: messageId });

  return (
    <Wrapper>
      <Header />
      <ErrorCard>
        <Alert type="error" message={message} />
      </ErrorCard>
    </Wrapper>
  );
};
