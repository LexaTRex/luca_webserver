import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { useQueryClient } from 'react-query';
import { LeftOutlined } from '@ant-design/icons';

import { BASE_GROUP_ROUTE } from '../../../../constants/routes';

import { Navigation } from './NavigationButton.styled';

export const NavigationButton = ({ location }) => {
  const intl = useIntl();
  const history = useHistory();
  const queryClient = useQueryClient();

  const navigate = () => {
    queryClient.invalidateQueries(`${location.groupId}`);
    history.push(`${BASE_GROUP_ROUTE}/${location.groupId}`);
  };

  return (
    <Navigation onClick={navigate} data-cy="toLocationOverview">
      <LeftOutlined style={{ marginRight: 14, fontSize: 10 }} />
      {intl.formatMessage({
        id: 'header.profile.back',
      })}
    </Navigation>
  );
};
