import React, { useState } from 'react';
import { Menu, Dropdown, notification } from 'antd';
import { useQueryClient } from 'react-query';
import { useIntl } from 'react-intl';
import { push } from 'connected-react-router';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import { LOGIN_ROUTE, PROFILE_ROUTE } from 'constants/routes';

import { usePrivateKey } from 'utils/privateKey';
import { clearHasSeenPrivateKeyModal } from 'utils/storage';

import { logout } from 'network/api';

import { ReactComponent as MenuDefaultSvg } from 'assets/MenuDefault.svg';
import { ReactComponent as MenuActiveSvg } from 'assets/MenuActive.svg';
import { StyledIcon, StyledMenuItem } from './DetailsDropdown.styled';

const DetailsMenu = properties => {
  const intl = useIntl();
  const history = useHistory();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [, clearPrivateKey] = usePrivateKey(null);

  const openProfile = () => {
    history.push(PROFILE_ROUTE);
  };

  const handleLogout = () => {
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

        dispatch(push(LOGIN_ROUTE));
        queryClient.clear();
        clearPrivateKey(null);
        clearHasSeenPrivateKeyModal();
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
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Menu {...properties}>
      <StyledMenuItem data-cy="profile" onClick={openProfile}>
        {intl.formatMessage({
          id: 'header.profile',
        })}
      </StyledMenuItem>
      <Menu.Divider />
      <StyledMenuItem data-cy="logout" onClick={handleLogout}>
        {intl.formatMessage({
          id: 'header.logout',
        })}
      </StyledMenuItem>
    </Menu>
  );
};

export const DetailsDropdown = () => {
  const [dropdownVisibility, setDropdownVisibility] = useState(false);

  return (
    <Dropdown
      overlay={<DetailsMenu />}
      placement="bottomRight"
      onVisibleChange={setDropdownVisibility}
    >
      <StyledIcon
        component={dropdownVisibility ? MenuActiveSvg : MenuDefaultSvg}
        data-cy="dropdownMenuTrigger"
      />
    </Dropdown>
  );
};
