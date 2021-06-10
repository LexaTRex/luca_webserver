import React from 'react';
import { Layout } from 'antd';

// Components
import { ProfileOverview } from './ProfileOverview';
import { ChangePassword } from './ChangePassword';
import { GroupOverview } from './GroupOverview';
import { Services } from './Services';
import { NavigationButton } from './NavigationButton';

import { contentStyles, sliderStyles, Wrapper, Header } from './Profile.styled';
import { AccountDeletion } from './AccountDeletion';

const { Content, Sider } = Layout;

export const Profile = ({ operator, refetch }) => {
  const accountIsActive = !operator.deletedAt;
  return (
    <Layout>
      <Sider style={sliderStyles}>
        <NavigationButton />
      </Sider>
      <Layout>
        <Content style={contentStyles}>
          <Wrapper>
            <Header data-cy="operatorName">{`${operator.firstName} ${operator.lastName}`}</Header>
            {accountIsActive && (
              <>
                <ProfileOverview operator={operator} refetch={refetch} />
                <ChangePassword />
              </>
            )}
            <GroupOverview />
            <Services supportCode={operator.supportCode} />
            <AccountDeletion operator={operator} refetch={refetch} />
          </Wrapper>
        </Content>
      </Layout>
    </Layout>
  );
};
