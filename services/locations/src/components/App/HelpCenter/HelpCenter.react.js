import React from 'react';
import { useIntl } from 'react-intl';
import { Layout } from 'antd';

import { LocationFooter } from 'components/App/LocationFooter';

import { NavigationButton } from './NavigationButton';
import { Links } from './Links';
import { ContactSection } from './ContactSection';

import {
  contentStyles,
  sliderStyles,
  Wrapper,
  Header,
  CardWrapper,
} from './HelpCenter.styled';

const { Content, Sider } = Layout;

export const HelpCenter = ({ operator }) => {
  const intl = useIntl();
  return (
    <Layout>
      <Sider style={sliderStyles}>
        <NavigationButton />
      </Sider>
      <Layout>
        <Content style={contentStyles}>
          <Wrapper>
            <Header data-cy="helpCenterTitle">
              {intl.formatMessage({ id: 'helpCenter.title' })}
            </Header>
            <CardWrapper data-cy="helpCenterWrapper">
              <Links />
              <ContactSection operator={operator} />
            </CardWrapper>
            <LocationFooter />
          </Wrapper>
        </Content>
      </Layout>
    </Layout>
  );
};
