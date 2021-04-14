import React from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { Route, Switch, Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';

// Constants
import {
  PROFILE_ROUTE,
  TRACKING_ROUTE,
  USER_MANAGEMENT_ROUTE,
  LOGIN_ROUTE,
} from 'constants/routes';
import { getMe } from 'network/api';

// Components
import { ModalArea } from 'components/App/modals/ModalArea';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { Profile } from './Profile';
import { Tracking } from './Tracking';
import { UserManagement } from './UserManagement';
import { AppWrapper } from './App.styled';

export const App = () => {
  const intl = useIntl();
  const history = useHistory();

  const title = intl.formatMessage({ id: 'main.site.title' });
  const meta = intl.formatMessage({ id: 'main.site.meta' });
  const {
    isLoading: isProfileLoading,
    error: isProfileError,
    data: profileData,
  } = useQuery('me', () => getMe(), {
    retry: false,
  });

  if (isProfileLoading) return null;

  if (isProfileError) {
    history.push(LOGIN_ROUTE);
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={meta} />
      </Helmet>
      <AppWrapper>
        <Header />
        <Navigation />
        <ModalArea />
        <Switch>
          <Route path={PROFILE_ROUTE}>
            <Profile profileData={profileData} />
          </Route>
          <Route path={TRACKING_ROUTE} component={Tracking} />
          <Route path={USER_MANAGEMENT_ROUTE} component={UserManagement} />
          <Redirect to={`${TRACKING_ROUTE}${window.location.search}`} />
        </Switch>
      </AppWrapper>
    </>
  );
};
