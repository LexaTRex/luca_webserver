import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';

// CONSTANTS
import { PROFILE_ROUTE } from 'constants/routes';

export const Profile = () => {
  const intl = useIntl();
  const history = useHistory();

  const handleClick = () => {
    history.push(PROFILE_ROUTE);
  };

  return (
    <div aria-hidden="true" onClick={handleClick}>
      {intl.formatMessage({
        id: 'header.profile',
      })}
    </div>
  );
};
