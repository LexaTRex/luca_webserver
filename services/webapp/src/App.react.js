import React from 'react';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

import moment from 'moment';
import 'moment/locale/de';

// i18n
import { IntlProvider } from 'react-intl';

import {
  HOME_PATH,
  HISTORY_PATH,
  SETTINGS_PATH,
  LICENSES_ROUTE,
  CHECK_OUT_PATH,
  APPOINTMENT_PATH,
  COVID_TEST_PATH,
  ON_BOARDING_PATH,
  SELF_CHECKIN_PATH,
  BASE_PRIVATE_MEETING_PATH,
  EDIT_CONTACT_INFORMATION_SETTING,
} from 'constants/routes';

import { getLanguage } from 'utils/language';

import { ErrorWrapper } from 'components/ErrorWrapper';

// Misc
import { Home } from 'components/Home';
import { History } from 'components/History';
import { Licenses } from 'components/Licenses';
import { Settings } from 'components/Settings';
import { CheckOut } from 'components/Checkout';
import { OnBoarding } from 'components/OnBoarding';
import { ContactInformation } from 'components/ContactInformation';
import { FeatureNotImplemented } from 'components/FeatureNotImplemented';

import { QRCodeScanner } from 'components/QRCodeScanner/QRCodeScanner.react';
import { AuthenticationWrapper } from 'components/AuthenticationWrapper.react';
import { PrivateMeeting } from 'components/PrivateMeeting/PrivateMeeting.react';

import { configureStore } from './configureStore';
import { AppWrapper } from './App.styled';
import { messages } from './messages';

const history = createBrowserHistory();
const store = configureStore(undefined, history);

moment.locale(getLanguage());
document.documentElement.lang = getLanguage();

const queryClient = new QueryClient();

export const Main = () => {
  return (
    <>
      <Helmet>
        <meta name="apple-itunes-app" content="app-id=1531742708" />
      </Helmet>
      <AppWrapper>
        <Provider store={store}>
          <IntlProvider
            locale={getLanguage()}
            messages={messages[getLanguage()]}
            wrapRichTextChunksInFragment
          >
            <QueryClientProvider client={queryClient}>
              <ConnectedRouter history={history}>
                <ErrorWrapper>
                  <AuthenticationWrapper>
                    <Switch>
                      <Route path={LICENSES_ROUTE} component={Licenses} />
                      <Route
                        path={`${ON_BOARDING_PATH}/:scannerId/`}
                        component={OnBoarding}
                      />
                      <Route path={ON_BOARDING_PATH} component={OnBoarding} />
                      <Route path={`${CHECK_OUT_PATH}/`} component={CheckOut} />
                      <Route
                        path={EDIT_CONTACT_INFORMATION_SETTING}
                        component={ContactInformation}
                      />
                      <Route
                        path={SELF_CHECKIN_PATH}
                        component={QRCodeScanner}
                      />
                      <Route path={HISTORY_PATH} component={History} />
                      <Route path={SETTINGS_PATH} component={Settings} />
                      <Route
                        path={[APPOINTMENT_PATH, COVID_TEST_PATH]}
                        component={FeatureNotImplemented}
                      />
                      <Route
                        component={PrivateMeeting}
                        path={`${BASE_PRIVATE_MEETING_PATH}/:scannerId`}
                      />
                      <Route
                        path={BASE_PRIVATE_MEETING_PATH}
                        component={PrivateMeeting}
                      />
                      <Route
                        path={`${HOME_PATH}/:scannerId`}
                        component={Home}
                      />
                      <Route path={HOME_PATH} component={Home} />
                    </Switch>
                  </AuthenticationWrapper>
                </ErrorWrapper>
              </ConnectedRouter>
            </QueryClientProvider>
          </IntlProvider>
        </Provider>
      </AppWrapper>
    </>
  );
};
