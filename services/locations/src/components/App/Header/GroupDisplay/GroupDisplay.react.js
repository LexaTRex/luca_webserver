import React from 'react';
import { replace } from 'connected-react-router';
import { useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
import { Tooltip } from 'antd';

import settings from 'assets/Edit.svg';

import { getGroup } from 'network/api';

import { BASE_GROUP_SETTINGS_ROUTE } from 'constants/routes';

import { Wrapper, GroupName, HomeIcon } from './GroupDisplay.styled';

export const GroupDisplay = ({ groupId }) => {
  const dispatch = useDispatch();

  const { isLoading, error, data: group } = useQuery(`group/${groupId}`, () =>
    getGroup(groupId)
  );

  const openSettings = () =>
    dispatch(replace(`${BASE_GROUP_SETTINGS_ROUTE}${group.groupId}`));

  if (isLoading || error) return null;

  return (
    <Wrapper onClick={openSettings} data-cy="groupName">
      <Tooltip title={group.name}>
        <GroupName>{group.name}</GroupName>
      </Tooltip>
      <HomeIcon src={settings} />
    </Wrapper>
  );
};
