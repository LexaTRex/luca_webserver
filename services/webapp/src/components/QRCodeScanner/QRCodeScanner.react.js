import React, { useCallback, useState } from 'react';

import { useIntl } from 'react-intl';
import { notification } from 'antd';
import { useHistory } from 'react-router-dom';
import { decodeUtf8 } from '@lucaapp/crypto';

import { checkin } from 'helpers/crypto';
import { getCheckOutPath } from 'helpers/routes';
import { base64UrlToBytes } from 'utils/encodings';
import { hasMobileCamAccess } from 'utils/environment';
import { checkinToPrivateMeeting } from 'helpers/privateMeeting';
import { HOME_PATH, BASE_PRIVATE_MEETING_PATH } from 'constants/routes';

import { SecondaryButton } from '../Buttons';
import { AppHeadline, AppLayout } from '../AppLayout';

import {
  StyledContent,
  StyledQRReader,
  StyledFooter,
} from './QRCodeScanner.styled';
import { PrivateMeetingWarningModal } from './PrivateMeetingWarningModal/PrivateMeetingWarningModal.react';

export function QRCodeScanner() {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [privateMeetingQRCodeData, setPrivateMeetingQRCodeData] = useState(
    null
  );

  const handleQRCode = useCallback(
    (qrData, isActivated = false) => {
      if (!qrData) return;

      if (qrData.includes(BASE_PRIVATE_MEETING_PATH)) {
        if (isActivated) {
          setPrivateMeetingQRCodeData(null);
        } else {
          setPrivateMeetingQRCodeData(qrData);
          return;
        }

        const [url, data] = (privateMeetingQRCodeData || qrData).split('#');
        const urlChunks = url.split('/');

        checkinToPrivateMeeting(urlChunks[urlChunks.length - 1], data)
          .then(traceId => {
            history.push(getCheckOutPath(traceId));
          })
          .catch(() => {
            notification.error({
              message: formatMessage({
                id: 'QRCodeScanner.error.invalidPrivateMeeting',
              }),
            });
          });
        return;
      }

      let decodedData;
      const urlChunks = qrData.split('/');
      const [scannerId, data] = urlChunks[urlChunks.length - 1].split('#');

      try {
        decodedData = JSON.parse(decodeUtf8(base64UrlToBytes(data)));
      } catch {
        decodedData = null;
      }

      checkin(scannerId, decodedData)
        .then(traceId => {
          history.push(getCheckOutPath(traceId));
        })
        .catch(() => {
          notification.error({
            message: formatMessage({
              id: 'QRCodeScanner.error.invalidQRCode',
            }),
          });
        });
    },
    [history, privateMeetingQRCodeData, formatMessage]
  );

  const handleError = () => {
    if (!hasMobileCamAccess()) {
      notification.error({
        message: formatMessage({
          id: 'QRCodeScanner.NotSupported',
        }),
      });
    }
    history.push(HOME_PATH);
  };

  return (
    <>
      <AppLayout
        header={
          <AppHeadline>
            {formatMessage({ id: 'QRCodeScanner.Headline' })}
          </AppHeadline>
        }
      >
        <StyledContent>
          <StyledQRReader
            delay={700}
            onScan={privateMeetingQRCodeData ? () => {} : handleQRCode}
            onError={handleError}
          />
        </StyledContent>
        <StyledFooter>
          <SecondaryButton onClick={() => history.push(HOME_PATH)}>
            {formatMessage({ id: 'Form.Cancel' })}
          </SecondaryButton>
        </StyledFooter>
      </AppLayout>
      {privateMeetingQRCodeData && (
        <PrivateMeetingWarningModal
          onCheck={() => handleQRCode(privateMeetingQRCodeData, true)}
          onCancel={() => setPrivateMeetingQRCodeData(false)}
        />
      )}
    </>
  );
}
