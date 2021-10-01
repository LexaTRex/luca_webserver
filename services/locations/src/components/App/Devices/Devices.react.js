import React from 'react';
import { Layout } from 'antd';
import { useIntl } from 'react-intl';

import { LocationFooter } from 'components/App/LocationFooter';

// Components
import { DeviceList } from './DeviceList';
import { AddDeviceButton } from './AddDeviceButton';
import { NavigationButton } from './NavigationButton';

import { contentStyles, sliderStyles, Wrapper, Header } from './Devices.styled';

const { Content, Sider } = Layout;

export const Devices = () => {
  const intl = useIntl();

  return (
    <Layout>
      <Sider style={sliderStyles}>
        <NavigationButton />
      </Sider>
      <Layout>
        <Content style={contentStyles}>
          <Wrapper>
            <Header>{intl.formatMessage({ id: 'device.title' })}</Header>
            <AddDeviceButton />
            <DeviceList />
            <LocationFooter />
          </Wrapper>
        </Content>
      </Layout>
    </Layout>
  );
};
