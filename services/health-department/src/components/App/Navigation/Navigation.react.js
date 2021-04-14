import React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Menu } from 'antd';

// Api
import { getMe } from 'network/api';

// Constants
import {
  PROFILE_ROUTE,
  TRACKING_ROUTE,
  USER_MANAGEMENT_ROUTE,
} from 'constants/routes';

// Components
import { NavigationWrapper } from './Navigation.styled';

export const Navigation = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const currentRoute = useSelector(state => state.router.location.pathname);

  const { isLoading, error, data: user } = useQuery('me', () => getMe());

  const handleClick = element => {
    dispatch(push(`${element.key}${window.location.search}`));
  };

  const viewOptions = [
    {
      value: TRACKING_ROUTE,
      intlId: 'navigation.tracking',
      backgroundColor:
        currentRoute === TRACKING_ROUTE ? '#b8c0ca' : 'transparent',
    },
    {
      value: PROFILE_ROUTE,
      intlId: 'navigation.profile',
      backgroundColor:
        currentRoute === PROFILE_ROUTE ? '#bdd5dc' : 'transparent',
    },
  ];

  const adminViewOptions = [
    ...viewOptions,
    {
      value: USER_MANAGEMENT_ROUTE,
      intlId: 'navigation.userManagement',
      backgroundColor:
        currentRoute === USER_MANAGEMENT_ROUTE ? 'white' : 'transparent',
    },
  ];

  const tabs = user?.isAdmin ? adminViewOptions : viewOptions;

  if (isLoading || error) return null;

  return (
    <NavigationWrapper>
      <Menu
        style={{
          border: 'none',
          backgroundColor: 'transparent',
        }}
        onClick={handleClick}
        selectedKeys={[currentRoute]}
        mode="horizontal"
      >
        {tabs.map(viewOption => (
          <Menu.Item
            key={viewOption.value}
            style={{
              backgroundColor: viewOption.backgroundColor,
              color: 'black',
              margin: 0,
              padding: '8px 16px',
              borderBottom: 'none',
            }}
          >
            {intl.formatMessage({
              id: viewOption.intlId,
            })}
          </Menu.Item>
        ))}
      </Menu>
    </NavigationWrapper>
  );
};
