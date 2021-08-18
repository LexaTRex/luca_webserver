import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import moment from 'moment';
import 'moment/locale/de';

// i18n
import { IntlProvider } from 'react-intl';
import { messages } from 'messages';

import { LOGIN_ROUTE, APP_ROUTE, LICENSES_ROUTE } from 'constants/routes';
import { getLanguage } from 'utils/language';

import { Login } from 'components/Login';
import { App } from 'components/App';
import { Licenses } from 'components/Licenses';
import { ErrorWrapper } from 'components/ErrorWrapper';
import { UnsupportedBrowserWrapper } from 'components/UnsupportedBrowserWrapper';

// Misc
import { configureStore } from './configureStore';

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
              <UnsupportedBrowserWrapper>
                <Switch>
                  <Route path={LICENSES_ROUTE} component={Licenses} />
                  <Route path={LOGIN_ROUTE} component={Login} />
                  <Route path={APP_ROUTE} component={App} />
                  <Redirect to={LOGIN_ROUTE} />
                </Switch>
              </UnsupportedBrowserWrapper>
            </ErrorWrapper>
          </ConnectedRouter>
        </QueryClientProvider>
      </IntlProvider>
    </Provider>
  );
};
