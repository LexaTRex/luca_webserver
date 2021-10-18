import React from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet-async';
import { Route, Switch, Redirect, useHistory } from 'react-router';
import { useQuery, useQueryClient } from 'react-query';

import { getMe } from 'network/api';

import { usePrivateKey } from 'utils/privateKey';
import { clearHasSeenPrivateKeyModal } from 'utils/storage';

import {
  LOGIN_ROUTE,
  PROFILE_ROUTE,
  HELP_CENTER_ROUTE,
  APP_ROUTE,
  GROUP_SETTINGS_ROUTE,
  LOCATION_SETTINGS_ROUTE,
  BASE_DATA_TRANSFER_ROUTE,
  DEVICES_ROUTE,
} from 'constants/routes';

import { ModalArea } from 'components/App/modals/ModalArea';
import { Header } from './Header';
import { Profile } from './Profile';
import { Devices } from './Devices';
import { Dashboard } from './Dashboard';
import { HelpCenter } from './HelpCenter';
import { GroupSettings } from './GroupSettings';
import { DataTransfers } from './DataTransfers';
import { LocationSettings } from './LocationSettings';

import { AppWrapper } from './App.styled';

export const App = () => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const history = useHistory();

  const [, clearPrivateKey] = usePrivateKey(null);

  const {
    isLoading: isOperatorLoading,
    error: operatorError,
    data: operator,
    refetch,
  } = useQuery('me', () => getMe(), {
    cacheTime: 0,
    retry: false,
  });

  if (operatorError) {
    queryClient.clear();
    clearPrivateKey(null);
    clearHasSeenPrivateKeyModal();
    history.push(LOGIN_ROUTE);
  }

  if (isOperatorLoading || operatorError) return null;

  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'locations.site.title',
          })}
        </title>
        <meta
          name="description"
          content={intl.formatMessage({
            id: 'locations.site.meta',
          })}
        />
      </Helmet>
      <AppWrapper>
        <Header operator={operator} />
        <ModalArea />
        <Switch>
          <Route path={PROFILE_ROUTE}>
            <Profile operator={operator} refetch={refetch} />
          </Route>
          <Route path={DEVICES_ROUTE}>
            <Devices />
          </Route>
          <Route path={HELP_CENTER_ROUTE}>
            <HelpCenter operator={operator} />
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
