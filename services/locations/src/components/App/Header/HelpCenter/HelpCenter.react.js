import React from 'react';

import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router';
import Icon from '@ant-design/icons';

// CONSTANTS
import { HELP_CENTER_ROUTE } from 'constants/routes';

import { ReactComponent as HelpCenterDefaultSvg } from 'assets/HelpDefault.svg';
import { ReactComponent as HelpCenterActiveSvg } from 'assets/HelpActive.svg';

import { HelpCenterComp } from './HelpCenter.styled';

const HelpCenterIcon = isActive => (
  <Icon
    component={isActive ? HelpCenterActiveSvg : HelpCenterDefaultSvg}
    style={{ fontSize: 32 }}
    data-cy="buttonHelpCenter"
  />
);

export const HelpCenter = () => {
  const intl = useIntl();
  const history = useHistory();
  const currentRoute = useLocation();

  const isHelpCenterRoute = currentRoute.pathname === HELP_CENTER_ROUTE;

  const handleClick = () => history.push(HELP_CENTER_ROUTE);

  return (
    <HelpCenterComp
      onClick={handleClick}
      title={intl.formatMessage({ id: 'helpCenter.title' })}
    >
      {HelpCenterIcon(isHelpCenterRoute)}
    </HelpCenterComp>
  );
};
