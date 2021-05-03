import React, { useState, useRef, useLayoutEffect } from 'react';
import { Tick } from 'react-crude-animated-tick';

import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import QrReader from 'react-qr-reader';
import * as UAParser from 'ua-parser-js';

// Constants
import { SCAN_TIMEOUT } from 'constants/timeouts';

// Hooks
import { useModal } from 'components/hooks/useModal';

// Api
import { getCurrentCount, getTotalCount, getAdditionalData } from 'network/api';

// Utils
import { Header } from 'components/Header';
import { isMobile } from 'utils/environment';
import { notifyScanError, handleScanData } from 'helpers';

import { AdditionalDataModal } from 'components/modals/AdditionalDataModal';

import {
  CamScannerWrapper,
  CheckinBox,
  Content,
  Count,
  SuccessWrapper,
  QrWrapper,
} from './CamScanner.styled';

export const CamScanner = ({ scanner }) => {
  const intl = useIntl();
  const [openModal, closeModal] = useModal();
  const [isSuccess, setIsSuccess] = useState(false);
  const [canScanCode, setCanScanCode] = useState(true);

  const agent = useRef(new UAParser().getResult());

  const title = intl.formatMessage({ id: 'camScanner.site.title' });
  const meta = intl.formatMessage({ id: 'camScanner.site.meta' });

  const { data: currentCount } = useQuery(
    'current',
    () =>
      getCurrentCount(scanner.scannerAccessId).then(response =>
        response.json()
      ),
    {
      refetchInterval: 500,
    }
  );

  const { data: totalCount } = useQuery(
    'total',
    () =>
      getTotalCount(scanner.scannerAccessId).then(response => response.json()),
    {
      refetchInterval: 500,
    }
  );

  const { data: additionalData } = useQuery('additionalData', () =>
    getAdditionalData(scanner.locationId).then(response => response.json())
  );

  const checkForAdditionalData = traceId => {
    if (scanner.tableCount || additionalData?.additionalData?.length > 0) {
      openModal({
        title: intl.formatMessage({
          id: 'modal.additionalData.title',
        }),
        content: (
          <AdditionalDataModal
            scanner={scanner}
            additionalData={additionalData.additionalData}
            traceId={traceId}
            close={() => {
              closeModal();
            }}
          />
        ),
        closable: false,
      });
    }
  };

  useLayoutEffect(() => {
    const parsed = agent.current;
    if (parsed.os.name === 'iOS' && parsed.browser.name !== 'Mobile Safari') {
      setCanScanCode(false);
    }
  }, []);

  const handleScan = scanData => {
    handleScanData({
      scanData,
      intl,
      scanner,
      setIsSuccess,
      checkForAdditionalData,
    });
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={meta} />
      </Helmet>
      <CamScannerWrapper>
        <Header />
        {canScanCode ? (
          <>
            <QrWrapper>
              {isSuccess ? (
                <QrReader
                  onError={error => notifyScanError(error, intl)}
                  onScan={() => {}}
                  showViewFinder={false}
                />
              ) : (
                <QrReader
                  delay={SCAN_TIMEOUT}
                  onError={error => notifyScanError(error, intl)}
                  onScan={handleScan}
                />
              )}
              {isSuccess && (
                <SuccessWrapper>
                  <Tick size={100} />
                </SuccessWrapper>
              )}
            </QrWrapper>
            <CheckinBox>
              <Content>
                {intl.formatMessage({
                  id: 'form.checkins',
                })}
                {isMobile && <br />}
                <b>{scanner.name}</b>
                {intl.formatMessage({
                  id: 'form.checkinsSuffix',
                })}
                <Count>
                  {currentCount}/{totalCount}
                </Count>
              </Content>
            </CheckinBox>
          </>
        ) : (
          <h3 style={{ color: 'white', padding: '40px 20px' }}>
            {intl.formatMessage({ id: 'error.browserNotSupported' })}
          </h3>
        )}
      </CamScannerWrapper>
    </>
  );
};
