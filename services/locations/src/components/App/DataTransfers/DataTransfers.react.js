import React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { Layout } from 'antd';

import { getAllTransfers } from 'network/api';

// Components
import { NavigationButton } from './NavigationButton';
import { TransferList } from './TransferList';
import {
  DataTransfersWrapper,
  Wrapper,
  Header,
  contentStyles,
  sliderStyles,
} from './DataTransfers.styled';

const { Content, Sider } = Layout;

export const DataTransfers = () => {
  const intl = useIntl();
  const { isLoading, error, data: transfers } = useQuery(`transfers`, () =>
    getAllTransfers()
  );

  if (error || isLoading) return null;

  return (
    <Layout>
      <Sider style={sliderStyles}>
        <NavigationButton />
      </Sider>
      <Layout>
        <Content style={contentStyles}>
          <Wrapper>
            <Header>
              {intl.formatMessage({
                id: 'shareData.title',
              })}
            </Header>
            <DataTransfersWrapper>
              <TransferList transfers={transfers} />
            </DataTransfersWrapper>
          </Wrapper>
        </Content>
      </Layout>
    </Layout>
  );
};
