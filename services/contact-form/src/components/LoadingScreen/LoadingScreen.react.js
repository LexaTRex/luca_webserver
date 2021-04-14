import React from 'react';
import { useIntl } from 'react-intl';
import { Spin } from 'antd';

import {
  Wrapper,
  LoadingWrapper,
  LoadingCard,
  Loading,
} from './LoadingScreen.styled';

export const LoadingScreen = () => {
  const intl = useIntl();

  return (
    <Wrapper>
      <LoadingWrapper>
        <LoadingCard>
          <Loading>
            <Spin size="large" tip={intl.formatMessage({ id: 'loading' })} />
          </Loading>
        </LoadingCard>
      </LoadingWrapper>
    </Wrapper>
  );
};
