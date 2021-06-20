import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { createBrowserHistory } from 'history';
import { QueryClient, QueryClientProvider } from 'react-query';

import moment from 'moment';
import 'moment/locale/de';

// Constants
import {
  APP_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  RESET_PASSWORD_ROUTE,
  ACTIVATION_ROUTE,
  ACTIVATE_EMAIL_ROUTE,
  REGISTER_BADGE_WITH_ID_ROUTE,
  REGISTER_BADGE_ROUTE,
  AUTHENTICATION_ROUTE,
  SHARE_DATA_ROUTE,
  LICENSES_ROUTE,
  SHARE_ALL_DATA_ROUTE,
} from 'constants/routes';

// i18n
import { IntlProvider } from 'react-intl';
import { messages } from 'messages';

import { getLanguage } from 'utils/language';

// Components
import { App } from 'components/App';
import { Authentication } from 'components/Authentication';
import { RegisterBadge } from 'components/RegisterBadge';
import { ForgotPassword } from 'components/ForgotPassword';
import { ResetPassword } from 'components/ResetPassword';
import { Activation } from 'components/Activation';
import { ActivateEmail } from 'components/ActivateEmail';
import { ShareData } from 'components/ShareData';
import { ErrorWrapper } from 'components/ErrorWrapper';
import { SmallDeviceWrapper } from 'components/SmallDeviceWrapper';

// Misc
import { configureStore } from './configureStore';
import { Licenses } from './components/Licenses';

const history = createBrowserHistory();
const store = configureStore(undefined, history);

moment.locale(getLanguage());
document.documentElement.lang = getLanguage();

const queryClient = new QueryClient();

export const Main = () => {
  return (
    <Provider store={store}>
      <IntlProvider
        locale={getLanguage()}
        messages={messages[getLanguage()]}
        wrapRichTextChunksInFragment
      >
        <QueryClientProvider client={queryClient}>
          <ConnectedRouter history={history}>
            <ErrorWrapper>
              <SmallDeviceWrapper>
                <Switch>
                  <Route
                    path={AUTHENTICATION_ROUTE}
                    component={Authentication}
                    exact
                  />
                  <Route path={LICENSES_ROUTE} component={Licenses} />
                  <Route
                    path={FORGOT_PASSWORD_ROUTE}
                    component={ForgotPassword}
                  />
                  <Route
                    path={RESET_PASSWORD_ROUTE}
                    component={ResetPassword}
                  />
                  <Route path={APP_ROUTE} component={App} />
                  <Route
                    path={REGISTER_BADGE_WITH_ID_ROUTE}
                    component={RegisterBadge}
                  />
                  <Route
                    path={REGISTER_BADGE_ROUTE}
                    render={() => <RegisterBadge requiresVerification />}
                  />
                  <Route path={SHARE_ALL_DATA_ROUTE} component={ShareData} />
                  <Route path={SHARE_DATA_ROUTE} component={ShareData} />
                  <Route path={ACTIVATION_ROUTE} component={Activation} />
                  <Route
                    path={ACTIVATE_EMAIL_ROUTE}
                    component={ActivateEmail}
                  />
                  <Redirect to={AUTHENTICATION_ROUTE} />
                </Switch>
              </SmallDeviceWrapper>
            </ErrorWrapper>
          </ConnectedRouter>
        </QueryClientProvider>
      </IntlProvider>
    </Provider>
  );
};
