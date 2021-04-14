import React from 'react';
import { Layout } from 'antd';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { getLocation } from 'network/api';

import { NavigationButton } from './NavigationButton';
import { SettingsOverview } from './SettingsOverview';
import { DeleteLocation } from './DeleteLocation';
import {
  Header,
  Wrapper,
  sliderStyles,
  contentStyles,
  SettingsContent,
} from './LocationSettings.styled';

const { Content, Sider } = Layout;

export const LocationSettings = () => {
  const intl = useIntl();
  const { locationId } = useParams();

  const {
    isError,
    isLoading,
    data: location,
    refetch,
  } = useQuery(`settings/${locationId}`, () => getLocation(locationId));

  if (isLoading || isError) return null;

  return (
    <Layout>
      <Sider style={sliderStyles}>
        <NavigationButton location={location} />
      </Sider>
      <Layout>
        <Content style={contentStyles}>
          <Wrapper>
            <Header>
              {location.name ||
                intl.formatMessage({ id: 'location.defaultName' })}
            </Header>
            <SettingsContent>
              <SettingsOverview
                refetch={refetch}
                location={location}
                isLast={location.name === null}
              />
              {location.name !== null && <DeleteLocation location={location} />}
            </SettingsContent>
          </Wrapper>
        </Content>
      </Layout>
    </Layout>
  );
};
