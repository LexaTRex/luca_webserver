import React from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { notification } from 'antd';

// API
import { logout } from 'network/api';

// CONSTANTS
import { AUTHENTICATION_ROUTE } from 'constants/routes';

export const Logout = () => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const handleClick = () => {
    logout()
      .then(response => {
        if (response.status >= 400) {
          notification.error({
            message: intl.formatMessage({
              id: 'notification.logout.error',
            }),
          });
          return;
        }

        dispatch(push(AUTHENTICATION_ROUTE));
        queryClient.clear();
        notification.success({
          message: intl.formatMessage({
            id: 'notification.logout.success',
          }),
        });
      })
      .catch(() =>
        notification.error({
          message: intl.formatMessage({
            id: 'notification.logout.error',
          }),
        })
      );
  };

  return (
    <div aria-hidden="true" onClick={handleClick}>
      {intl.formatMessage({
        id: 'header.logout',
      })}
    </div>
  );
};
