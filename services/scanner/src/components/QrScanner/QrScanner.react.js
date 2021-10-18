import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet-async';

import { Header } from 'components/Header';
import { ScanForm } from './ScanForm';
import { ScannerWrapper } from './QrScanner.styled';

export const QrScanner = ({ scanner }) => {
  const intl = useIntl();
  const [outerFocus, setOuterFocus] = useState(false);

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'scanner.site.title' })}</title>
        <meta
          name="description"
          content={intl.formatMessage({ id: 'scanner.site.meta' })}
        />
      </Helmet>
      <ScannerWrapper
        onClick={() => {
          setOuterFocus(true);
        }}
      >
        <Header />
        <ScanForm
          scanner={scanner}
          outerFocus={outerFocus}
          setOuterFocus={setOuterFocus}
        />
      </ScannerWrapper>
    </>
  );
};
