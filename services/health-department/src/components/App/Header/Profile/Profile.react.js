import React from 'react';
import { Badge } from 'antd';
import Icon from '@ant-design/icons';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

// API
import { getSigningTool } from 'network/api';

// Constants
import { PROFILE_ROUTE } from 'constants/routes';

import { ReactComponent as ProfileSvg } from 'assets/profile.svg';
import { ReactComponent as ProfileActiveSvg } from 'assets/profile_active.svg';

import { IconWrapper, badgeStyle } from './Profile.styled';

const getProfileIcon = isProfileRoute => (
  <Icon
    component={isProfileRoute ? ProfileActiveSvg : ProfileSvg}
    style={{ color: 'black', fontSize: 32 }}
  />
);

export const Profile = ({ healthDepartment }) => {
  const history = useHistory();
  const currentRoute = useSelector(state => state.router.location.pathname);
  const isProfileRoute = currentRoute === PROFILE_ROUTE;
  const handleClick = () => history.push(PROFILE_ROUTE);

  const { data: signingTool = [] } = useQuery('signingTool', () =>
    getSigningTool()
  );

  const showDot =
    signingTool.length > 0 &&
    !healthDepartment.signedPublicHDEKP &&
    !healthDepartment.signedPublicHDSKP;

  return (
    <Badge dot={showDot} style={badgeStyle}>
      <IconWrapper onClick={handleClick}>
        {getProfileIcon(isProfileRoute)}
      </IconWrapper>
    </Badge>
  );
};
