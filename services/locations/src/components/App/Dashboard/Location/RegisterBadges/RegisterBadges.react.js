import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { PrimaryButton } from 'components/general';
import { REGISTER_BADGE_ROUTE } from 'constants/routes';

export const RegisterBadges = () => {
  const intl = useIntl();

  return (
    <Link to={REGISTER_BADGE_ROUTE} target="_blank">
      <PrimaryButton style={{ marginRight: '15px' }}>
        {intl.formatMessage({ id: 'registerBadge.title' })}
      </PrimaryButton>
    </Link>
  );
};
