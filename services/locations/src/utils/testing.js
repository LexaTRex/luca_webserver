import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import '@testing-library/jest-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, queries, configure } from '@testing-library/react';

// Providers
import { messages } from 'messages';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { configureStore } from 'configureStore';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl';

const history = createBrowserHistory();
const store = configureStore(undefined, history);
const queryClient = new QueryClient();
const intlCache = createIntlCache();

const intl = createIntl(
  {
    locale: 'de',
    messages: messages.de,
  },
  intlCache
);

const customRender = ui => {
  return render(
    <Provider store={store}>
      <RawIntlProvider value={intl}>
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
      </RawIntlProvider>
    </Provider>,
    {
      queries: {
        ...queries,
      },
    }
  );
};

// re-export everything
// eslint-disable-next-line import/no-extraneous-dependencies
export * from '@testing-library/react';

// override render method
export { customRender as render };

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export async function waitToBeCalled(mockFunction, maxChecks = 50) {
  for (let check = 0; check < maxChecks; check++) {
    // eslint-disable-next-line no-await-in-loop
    await delay(200);
    if (mockFunction.mock.calls.length > 0) {
      return;
    }
  }
}

configure({ testIdAttribute: 'data-cy' });
