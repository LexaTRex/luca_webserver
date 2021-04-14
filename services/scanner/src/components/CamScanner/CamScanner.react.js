import React, { useState, useRef, useLayoutEffect } from 'react';
import { Tick } from 'react-crude-animated-tick';

import moment from 'moment';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import QrReader from 'react-qr-reader';
import * as UAParser from 'ua-parser-js';

// Constants
import { MINIMAL_SUPPORT_VERION } from 'constants/versionSupport';
import { SCAN_TIMEOUT } from 'constants/timeouts';

// Hooks
import { useModal } from 'components/hooks/useModal';

// Api
import {
  createCheckinV3,
  getCurrentCount,
  getTotalCount,
  getAdditionalData,
} from 'network/api';

// Utils
import { Header } from 'components/Header';
import { isMobile } from 'utils/environment';
import { isLocalTimeCorrect } from 'helpers/time';
import { decode, STATIC_DEVICE_TYPE } from 'utils/qr';
import {
  getV3BadgeCheckinPayload,
  getV4BadgeCheckinPayload,
  getV3AppCheckinPayload,
  notifyScanError,
  DECODE_FAILED,
  DOUPLICATE_CHECKIN,
  TIMESTAMP_OUTDATED,
  VERSION_NOT_SUPPORTED,
  WRONG_LOCAL_TIME,
} from 'helpers';

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

  const handleScan = async scanData => {
    if (!scanData) return;
    const qrData = await decode(scanData);

    const timeCorrect = await isLocalTimeCorrect();
    if (!timeCorrect) {
      notifyScanError(WRONG_LOCAL_TIME, intl);
      return;
    }

    if (!qrData) {
      notifyScanError(DECODE_FAILED, intl);
      return;
    }

    if (qrData.v < MINIMAL_SUPPORT_VERION) {
      notifyScanError(VERSION_NOT_SUPPORTED, intl);
      return;
    }

    if (qrData.v === 3) {
      if (qrData.deviceType === STATIC_DEVICE_TYPE) {
        // static qr codes
        const v3BagdePayload = getV3BadgeCheckinPayload(qrData, scanner);

        createCheckinV3(v3BagdePayload)
          .then(response => {
            if (response.status === 409) {
              notifyScanError(DOUPLICATE_CHECKIN, intl);
              return;
            }
            setIsSuccess(true);
            setTimeout(() => {
              setIsSuccess(false);
            }, SCAN_TIMEOUT);
            checkForAdditionalData(v3BagdePayload.traceId);
          })
          .catch(error => notifyScanError(error, intl));
        return;
      }
      // App with v3

      // Check that qr code is not older than 5 minutes
      const timestamp = moment().seconds(0);
      if (Math.abs(timestamp.unix() - qrData.timestamp) > 300) {
        notifyScanError(TIMESTAMP_OUTDATED, intl);
        return;
      }

      const v3AppCheckinPayload = getV3AppCheckinPayload(scanner, qrData);

      createCheckinV3(v3AppCheckinPayload)
        .then(response => {
          if (response.status === 409) {
            notifyScanError(DOUPLICATE_CHECKIN, intl);
            return;
          }
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
          }, SCAN_TIMEOUT);
          checkForAdditionalData(qrData.traceId);
        })
        .catch(error => notifyScanError(error, intl));
      return;
    }
    if (qrData.v === 4 && qrData.deviceType === STATIC_DEVICE_TYPE) {
      const v4BadgePayload = await getV4BadgeCheckinPayload(qrData, scanner);
      createCheckinV3(v4BadgePayload)
        .then(response => {
          if (response.status === 409) {
            notifyScanError(DOUPLICATE_CHECKIN, intl);
            return;
          }
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
          }, SCAN_TIMEOUT);
          checkForAdditionalData(v4BadgePayload.traceId);
        })
        .catch(error => notifyScanError(error, intl));
      return;
    }

    notifyScanError(VERSION_NOT_SUPPORTED, intl);
  };

  useLayoutEffect(() => {
    const parsed = agent.current;
    if (parsed.os.name === 'iOS' && parsed.browser.name !== 'Mobile Safari') {
      setCanScanCode(false);
    }
  }, []);

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
