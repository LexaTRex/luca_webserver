import React from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { Route, Switch, Redirect, useHistory } from 'react-router';
import { useQuery } from 'react-query';

import { getMe } from 'network/api';

// Constants
import {
  AUTHENTICATION_ROUTE,
  PROFILE_ROUTE,
  APP_ROUTE,
  GROUP_SETTINGS_ROUTE,
  LOCATION_SETTINGS_ROUTE,
  BASE_DATA_TRANSFER_ROUTE,
} from 'constants/routes';

// Components
import { ModalArea } from 'components/App/modals/ModalArea';
import { Header } from './Header';
import { Profile } from './Profile';
import { Dashboard } from './Dashboard';
import { GroupSettings } from './GroupSettings';
import { DataTransfers } from './DataTransfers';
import { LocationSettings } from './LocationSettings';
import { AppWrapper } from './App.styled';

export const App = () => {
  const intl = useIntl();
  const history = useHistory();

  const title = intl.formatMessage({
    id: 'locations.site.title',
  });
  const meta = intl.formatMessage({
    id: 'locations.site.meta',
  });

  const {
    isLoading: isOperatorLoading,
    error: operatorError,
    data: operator,
    refetch,
  } = useQuery('me', () => getMe().then(response => response.json()), {
    cacheTime: 0,
    retry: false,
  });

  if (operatorError) {
    history.push(AUTHENTICATION_ROUTE);
  }

  if (isOperatorLoading || operatorError) return null;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={meta} />
      </Helmet>
      <AppWrapper>
        <Header operator={operator} />
        <ModalArea />
        <Switch>
          <Route path={PROFILE_ROUTE}>
            <Profile operator={operator} refetch={refetch} />
          </Route>
          <Route path={GROUP_SETTINGS_ROUTE}>
            <GroupSettings />
          </Route>
          <Route path={LOCATION_SETTINGS_ROUTE}>
            <LocationSettings />
          </Route>
          <Route path={BASE_DATA_TRANSFER_ROUTE}>
            <DataTransfers />
          </Route>
          <Route path={APP_ROUTE}>
            <Dashboard operator={operator} />
          </Route>
          <Redirect to={APP_ROUTE} />
        </Switch>
      </AppWrapper>
    </>
  );
};
