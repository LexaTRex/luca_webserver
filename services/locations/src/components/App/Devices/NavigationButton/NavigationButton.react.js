import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { LeftOutlined } from '@ant-design/icons';

import { Navigation } from './NavigationButton.styled';

export const NavigationButton = () => {
  const intl = useIntl();
  const history = useHistory();

  return (
    <Navigation onClick={history.goBack}>
      <LeftOutlined style={{ marginRight: 14, fontSize: 10 }} />
      {intl.formatMessage({
        id: 'header.profile.back',
      })}
    </Navigation>
  );
};
