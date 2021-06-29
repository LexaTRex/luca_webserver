import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Button } from 'antd';
import { REGISTER_BADGE_ROUTE } from 'constants/routes';

import { buttonStyles } from './RegisterBadges.styled';

export const RegisterBadges = () => {
  const intl = useIntl();

  return (
    <Link to={REGISTER_BADGE_ROUTE} target="_blank">
      <Button style={buttonStyles}>
        {intl.formatMessage({ id: 'registerBadge.title' })}
      </Button>
    </Link>
  );
};
