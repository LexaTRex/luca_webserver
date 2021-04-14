import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { LeftOutlined } from '@ant-design/icons';

import { BASE_GROUP_ROUTE } from 'constants/routes';

import { Navigation } from './NavigationButton.styled';

export const NavigationButton = ({ group }) => {
  const intl = useIntl();
  const history = useHistory();

  const navigate = () => history.push(`${BASE_GROUP_ROUTE}${group.groupId}`);

  return (
    <Navigation onClick={navigate}>
      <LeftOutlined style={{ marginRight: 14, fontSize: 10 }} />
      {intl.formatMessage({
        id: 'group.settings',
      })}
    </Navigation>
  );
};
