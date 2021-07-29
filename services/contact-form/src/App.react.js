import React from 'react';
import { useParams } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import moment from 'moment';
import 'moment/locale/de';

import { getLanguage } from 'utils/language';
import { ErrorWrapper } from 'components/ErrorWrapper';

// Api
import { getForm } from 'network/api';

// i18n
import { IntlProvider } from 'react-intl';
import { messages } from 'messages';

// Constants
import { CONTACT_FORM_ROUTE, LICENSES_ROUTE } from 'constants/routes';

// Misc
import { Header } from 'components/Header';
import { ErrorPage } from 'components/ErrorPage';
import { LoadingScreen } from 'components/LoadingScreen';
import { ContactForm } from 'components/ContactForm';
import { Licenses } from 'components/Licenses';
import { configureStore } from './configureStore';
import { AppWrapper } from './App.styled';

const history = createBrowserHistory();
const store = configureStore(undefined, history);

moment.locale(getLanguage());
document.documentElement.lang = getLanguage();

const LoadContactFormHOC = ({ component: Component }) => {
  const { formId } = useParams();

  const { isLoading, error, data } = useQuery(
    'scanner',
    () => getForm(formId).then(response => response.json()),
    { retry: false }
  );

  if (isLoading) return <LoadingScreen />;

  if (error || data.error) return <ErrorPage error={error || data.error} />;

  return (
    <>
      <Component scanner={data} formId={formId} />
    </>
  );
};

const queryClient = new QueryClient();

export const Main = () => {
  return (
    <Provider store={store}>
      <IntlProvider
        locale={getLanguage()}
        messages={messages[getLanguage()]}
        wrapRichTextChunksInFragment
      >
        <ConnectedRouter history={history}>
          <QueryClientProvider client={queryClient}>
            <ErrorWrapper>
              <AppWrapper>
                <Header />
                <Switch>
                  <Route path={LICENSES_ROUTE} component={Licenses} />
                  <Route path={CONTACT_FORM_ROUTE}>
                    <LoadContactFormHOC component={ContactForm} />
                  </Route>
                </Switch>
              </AppWrapper>
            </ErrorWrapper>
          </QueryClientProvider>
        </ConnectedRouter>
      </IntlProvider>
    </Provider>
  );
};
