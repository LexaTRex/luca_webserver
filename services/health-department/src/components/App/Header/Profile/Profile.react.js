import React from 'react';
import Icon from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Constants
import { PROFILE_ROUTE } from 'constants/routes';

import { ReactComponent as ProfileSvg } from 'assets/profile.svg';
import { ReactComponent as ProfileActiveSvg } from 'assets/profile_active.svg';

import { IconWrapper } from './Profile.styled';

const getProfileIcon = isProfileRoute => (
  <Icon
    component={isProfileRoute ? ProfileActiveSvg : ProfileSvg}
    style={{ color: 'black', fontSize: 32 }}
  />
);

export const Profile = () => {
  const history = useHistory();
  const currentRoute = useSelector(state => state.router.location.pathname);
  const isProfileRoute = currentRoute === PROFILE_ROUTE;
  const handleClick = () => history.push(PROFILE_ROUTE);

  return (
    <IconWrapper onClick={handleClick}>
      {getProfileIcon(isProfileRoute)}
    </IconWrapper>
  );
};
