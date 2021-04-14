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
import { LinkMenu } from './LinkMenu';
import { CreateGroup } from './CreateGroup';
import { SelectGroup } from './SelectGroup';
import { GroupDisplay } from './GroupDisplay';
import { DataRequests } from './DataRequests';
import {
  HeaderWrapper,
  Logo,
  SubTitle,
  Title,
  MenuWrapper,
} from './Header.styled';

export const Header = () => {
  const intl = useIntl();
  const isTablet = useTabletSize();
  const locationsRoute = useRouteMatch(LOCATION_ROUTE);
  const groupSettingsRoute = useRouteMatch(GROUP_SETTINGS_ROUTE);

  const groupId =
    locationsRoute?.params?.groupId || groupSettingsRoute?.params?.groupId;

  return (
    <HeaderWrapper>
      <Title>
        <Link
          to={groupId ? `${BASE_GROUP_ROUTE}${groupId}` : `${BASE_GROUP_ROUTE}`}
        >
          <Logo src={LucaLogo} data-cy="home" />
        </Link>
        <SubTitle>
          {intl.formatMessage({
            id: 'header.subtitle',
          })}
        </SubTitle>
        {groupId && <GroupDisplay groupId={groupId} />}
      </Title>
      <MenuWrapper>
        {groupId && <SelectGroup groupId={groupId} />}
        {!isTablet && <CreateGroup />}
        <DataRequests />
        <LinkMenu />
      </MenuWrapper>
    </HeaderWrapper>
  );
};
