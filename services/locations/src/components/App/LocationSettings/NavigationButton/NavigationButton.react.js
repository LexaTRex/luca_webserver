import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';

import { BASE_GROUP_ROUTE } from 'constants/routes';

import { Navigation, LeftOutlinedLuca } from './NavigationButton.styled';

export const NavigationButton = ({ location }) => {
  const intl = useIntl();
  const history = useHistory();

  const navigate = () =>
    history.push(
      location.uuid
        ? `${BASE_GROUP_ROUTE}${location.groupId}/location/${location.uuid}`
        : `${BASE_GROUP_ROUTE}${location.groupId}`
    );

  return (
    <Navigation onClick={navigate} data-cy="toLocationOverview">
      <LeftOutlinedLuca />
      {intl.formatMessage({
        id: 'header.profile.back',
      })}
    </Navigation>
  );
};
