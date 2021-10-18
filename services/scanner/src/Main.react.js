import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { ConnectedRouter } from 'connected-react-router';
import { useParams } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import moment from 'moment';
import 'moment/locale/de';

import { getLanguage } from 'utils/language';

import { getScanner } from 'network/api';

import {
  CAM_SCANNER_ROUTE,
  SCANNER_ROUTE,
  LICENSES_ROUTE,
} from 'constants/routes';

import { IntlProvider } from 'react-intl';
import { messages } from 'messages';

import { ModalArea } from 'components/modals/ModalArea';
import { QrScanner } from 'components/QrScanner';
import { CamScanner } from 'components/CamScanner';
import { ErrorPage } from 'components/ErrorPage';
import { LoadingScreen } from 'components/LoadingScreen';
import { ErrorWrapper } from 'components/ErrorWrapper';
import { Licenses } from 'components/Licenses';

import { configureStore } from './configureStore';

const history = createBrowserHistory();
const store = configureStore(undefined, history);

moment.locale(getLanguage());
document.documentElement.lang = getLanguage();

const LoadScannerHOC = ({ component: Component }) => {
  const { scannerAccessId } = useParams();

  const { isLoading, error, data: scanner } = useQuery(
    'scanner',
    () => getScanner(scannerAccessId).then(response => response.json()),
    { retry: false }
  );

  if (isLoading) return <LoadingScreen />;

  if (error || scanner.error)
    return <ErrorPage error={error || scanner.error} />;

  return (
    <>
      <ModalArea />
      <Component scanner={scanner} />
    </>
  );
};

const queryClient = new QueryClient();

export const Main = () => {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <IntlProvider
          locale={getLanguage()}
          messages={messages[getLanguage()]}
          wrapRichTextChunksInFragment
        >
          <ConnectedRouter history={history}>
            <QueryClientProvider client={queryClient}>
              <ErrorWrapper>
                <Switch>
                  <Route path={LICENSES_ROUTE} component={Licenses} />
                  <Route path={CAM_SCANNER_ROUTE}>
                    <LoadScannerHOC component={CamScanner} />
                  </Route>
                  <Route path={SCANNER_ROUTE}>
                    <LoadScannerHOC component={QrScanner} />
                  </Route>
                </Switch>
              </ErrorWrapper>
            </QueryClientProvider>
          </ConnectedRouter>
        </IntlProvider>
      </HelmetProvider>
    </Provider>
  );
};
