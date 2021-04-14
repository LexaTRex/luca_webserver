import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useQueryClient } from 'react-query';
import { push } from 'connected-react-router';
import { Button, notification } from 'antd';

// API
import { logout } from 'network/api';

// CONSTANTS
import { LOGIN_ROUTE } from 'constants/routes';
import { clearPrivateKeys } from 'utils/cryptoKeyOperations';

export const LogoutButton = () => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const handleClick = () => {
    logout()
      .then(response => {
        clearPrivateKeys();
        if (response.status >= 400) {
          notification.error({
            message: intl.formatMessage({
              id: 'header.logout.error',
            }),
          });

          return;
        }
        dispatch(push(LOGIN_ROUTE));
        queryClient.clear();
      })
      .catch(error => console.error(error));
  };
  return (
    <Button
      style={{
        border: 'none',
        padding: '0 80px',
        backgroundColor: '#b8c0ca',
      }}
      shape="round"
      onClick={handleClick}
    >
      {intl.formatMessage({
        id: 'header.logout',
      })}
    </Button>
  );
};
