import React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { getGroups } from 'network/api';

import {
  Content,
  Heading,
  Wrapper,
  Count,
  Details,
  Detail,
  GroupName,
} from './GroupOverview.styled';

export const GroupOverview = () => {
  const intl = useIntl();

  const { isLoading, error, data: groups } = useQuery('profileGroups', () =>
    getGroups()
  );

  if (isLoading || error) return null;
  return (
    <Content>
      <Heading>{intl.formatMessage({ id: 'profile.groups.overview' })}</Heading>
      <Wrapper data-cy="groupsOverview">
        <Count>{groups.length}</Count>
        <Details>
          {groups.map((group, index) => (
            <Detail key={group.groupId}>
              <div style={{ marginRight: 16 }}>{index + 1}</div>
              <GroupName>{group.name}</GroupName>
            </Detail>
          ))}
        </Details>
      </Wrapper>
    </Content>
  );
};
