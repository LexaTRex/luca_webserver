import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';

import { Navigation, StyledLeftOutlined } from './NavigationButton.styled';

export const NavigationButton = () => {
  const intl = useIntl();
  const history = useHistory();

  const navigate = () => history.goBack();

  return (
    <Navigation onClick={navigate} data-cy="helpCenterBackButton">
      <StyledLeftOutlined />
      {intl.formatMessage({
        id: 'header.profile.back',
      })}
    </Navigation>
  );
};
