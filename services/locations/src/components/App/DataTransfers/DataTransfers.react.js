import React from 'react';
import { useIntl } from 'react-intl';
import { Layout } from 'antd';
import { WarningButton } from 'components/general';
import { useQuery } from 'react-query';

import { getAllTransfers } from 'network/api';
import { SHARE_ALL_DATA_ROUTE } from 'constants/routes';

// Components
import { LocationFooter } from 'components/App/LocationFooter';
import { NavigationButton } from './NavigationButton';
import { TransferList } from './TransferList';
import {
  DataTransfersWrapper,
  Wrapper,
  Header,
  ButtonWrapper,
  contentStyles,
  sliderStyles,
} from './DataTransfers.styled';

const { Content, Sider } = Layout;

export const DataTransfers = () => {
  const intl = useIntl();
  const { isLoading, error, data: transfers } = useQuery(`transfers`, () =>
    getAllTransfers()
  );
  const uncompletedTransfers = (transfers || [])
    .filter(transfer => !!transfer.contactedAt && !transfer.isCompleted)
    .map(transfer => transfer.uuid);

  const shareAll = () => window.open(SHARE_ALL_DATA_ROUTE);

  if (error || isLoading) return null;

  return (
    <Layout>
      <Sider style={sliderStyles}>
        <NavigationButton />
      </Sider>
      <Layout data-cy="dataTransfers">
        <Content style={contentStyles}>
          <Wrapper>
            <Header data-cy="dataTransfersTitle">
              {intl.formatMessage({
                id: 'shareData.title',
              })}
            </Header>
            <ButtonWrapper>
              {!!uncompletedTransfers.length && (
                <WarningButton
                  onClick={shareAll}
                  disabled={!uncompletedTransfers.length}
                >
                  {intl.formatMessage({ id: 'shareData.shareAll' })}
                </WarningButton>
              )}
            </ButtonWrapper>
            <DataTransfersWrapper>
              <TransferList transfers={transfers} />
            </DataTransfersWrapper>
            <LocationFooter />
          </Wrapper>
        </Content>
      </Layout>
    </Layout>
  );
};
