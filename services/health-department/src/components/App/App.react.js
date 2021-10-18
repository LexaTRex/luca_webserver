import React from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import { Route, Switch, Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  PROFILE_ROUTE,
  TRACKING_ROUTE,
  USER_MANAGEMENT_ROUTE,
  LOGIN_ROUTE,
  PROCESS_DETAILS_ROUTE,
} from 'constants/routes';
import { getMe } from 'network/api';

import { ModalArea } from 'components/App/modals/ModalArea';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { Profile } from './Profile';
import { Tracking } from './Tracking';
import { UserManagement } from './UserManagement';
import { ProcessDetails } from './ProcessDetails';
import { AppWrapper } from './App.styled';

export const App = () => {
  const intl = useIntl();
  const history = useHistory();
  const currentRoute = useSelector(state => state.router.location.pathname);
  const isProfileRoute = currentRoute === PROFILE_ROUTE;
  const { isLoading: isProfileLoading, data: healthDepartmentUser } = useQuery(
    'me',
    () => getMe(),
    {
      retry: false,
      onError: () => {
        history.push(LOGIN_ROUTE);
      },
    }
  );

  if (isProfileLoading) return null;

  const { isAdmin, isSigned } = healthDepartmentUser;

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'main.site.title' })}</title>
        <meta
          name="description"
          content={intl.formatMessage({ id: 'main.site.meta' })}
        />
      </Helmet>
      <AppWrapper>
        <Header profileData={healthDepartmentUser} />
        {!isProfileRoute && <Navigation />}
        <ModalArea />
        <Switch>
          <Route path={PROFILE_ROUTE}>
            <Profile profileData={healthDepartmentUser} />
          </Route>
          <Route path={PROCESS_DETAILS_ROUTE}>
            <ProcessDetails />
          </Route>
          <Route path={TRACKING_ROUTE}>
            <Tracking isHealthDepartmentSigned={isSigned} />
          </Route>
          {isAdmin && (
            <Route path={USER_MANAGEMENT_ROUTE}>
              <UserManagement profileData={healthDepartmentUser} />
            </Route>
          )}
          <Redirect to={`${TRACKING_ROUTE}${window.location.search}`} />
        </Switch>
      </AppWrapper>
    </>
  );
};
