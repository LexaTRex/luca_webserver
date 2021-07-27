import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Layout } from 'antd';

import { getGroup } from 'network/api';

import { LocationFooter } from 'components/App/LocationFooter';

import { NavigationButton } from './NavigationButton';
import { SettingsOverview } from './SettingsOverview';
import { GroupOverview } from './GroupOverview';
import { DeleteGroup } from './DeleteGroup';
import {
  contentStyles,
  sliderStyles,
  Wrapper,
  Header,
  SettingsContent,
} from './GroupSettings.styled';

const { Content, Sider } = Layout;

export const GroupSettings = () => {
  const { groupId } = useParams();
  const {
    isLoading,
    error,
    data: group,
    refetch,
  } = useQuery(`group/${groupId}`, () => getGroup(groupId));

  if (isLoading || error) return null;

  return (
    <Layout>
      <Sider style={sliderStyles}>
        <NavigationButton group={group} />
      </Sider>
      <Layout>
        <Content style={contentStyles}>
          <Wrapper>
            <Header data-cy="groupSettingsHeader">{group.name}</Header>
            <GroupOverview group={group} />
            <SettingsContent>
              <SettingsOverview group={group} refetch={refetch} />
              <DeleteGroup group={group} />
            </SettingsContent>
            <LocationFooter />
          </Wrapper>
        </Content>
      </Layout>
    </Layout>
  );
};
