import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router';

import {
  LOCATION_ROUTE,
  BASE_GROUP_ROUTE,
  GROUP_SETTINGS_ROUTE,
} from 'constants/routes';
import { useTabletSize } from 'components/hooks/media';

// Assets
import LucaLogo from 'assets/LucaLogoWhite.svg';

import { Devices } from './Devices';
import { HelpCenter } from './HelpCenter';
import { CreateGroup } from './CreateGroup';
import { SelectGroup } from './SelectGroup';
import { GroupDisplay } from './GroupDisplay';
import { DataRequests } from './DataRequests';
import { DetailsDropdown } from './DetailsDropdown';
import {
  Logo,
  Title,
  SubTitle,
  MenuWrapper,
  HeaderWrapper,
} from './Header.styled';

export const Header = ({ operator }) => {
  const intl = useIntl();
  const isTablet = useTabletSize();
  const locationsRoute = useRouteMatch(LOCATION_ROUTE);
  const groupSettingsRoute = useRouteMatch(GROUP_SETTINGS_ROUTE);

  const groupId =
    locationsRoute?.params?.groupId || groupSettingsRoute?.params?.groupId;

  const isActiveAccount = !operator.deletedAt;

  return (
    <HeaderWrapper>
      <Title>
        <Link
          to={groupId ? `${BASE_GROUP_ROUTE}${groupId}` : `${BASE_GROUP_ROUTE}`}
          style={{ lineHeight: 0 }}
        >
          <Logo src={LucaLogo} data-cy="home" />
        </Link>
        <SubTitle>
          {intl.formatMessage({
            id: 'header.subtitle',
          })}
        </SubTitle>
        {isActiveAccount && groupId && <GroupDisplay groupId={groupId} />}
      </Title>
      <MenuWrapper>
        {isActiveAccount && groupId && <SelectGroup groupId={groupId} />}
        {isActiveAccount && !isTablet && <CreateGroup />}
        <DataRequests />
        {operator.allowOperatorDevices && <Devices />}
        <HelpCenter />
        <DetailsDropdown />
      </MenuWrapper>
    </HeaderWrapper>
  );
};
