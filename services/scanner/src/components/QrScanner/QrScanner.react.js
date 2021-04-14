import React from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';

// Components
import { Header } from 'components/Header';
import { ScanForm } from './ScanForm';
import { ScannerWrapper } from './QrScanner.styled';

export const QrScanner = ({ scanner }) => {
  const intl = useIntl();

  const title = intl.formatMessage({ id: 'scanner.site.title' });
  const meta = intl.formatMessage({ id: 'scanner.site.meta' });

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={meta} />
      </Helmet>
      <ScannerWrapper>
        <Header />
        <ScanForm scanner={scanner} />
      </ScannerWrapper>
    </>
  );
};
