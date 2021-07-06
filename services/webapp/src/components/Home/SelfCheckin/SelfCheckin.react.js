import React, { useCallback, useState } from 'react';

import { notification } from 'antd';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { decodeUtf8, base64UrlToBytes } from '@lucaapp/crypto';

import { BASE_PRIVATE_MEETING_PATH } from 'constants/routes';
import { CWA_URL_SPLIT } from 'constants/cwa';

import { checkin } from 'helpers/crypto';
import { getCheckOutPath } from 'helpers/routes';
import { AccountDeletedError } from 'network/api';
import { checkinToPrivateMeeting } from 'helpers/privateMeeting';

import { AppContent } from 'components/AppLayout';
import { QRCodeScanner } from 'components/QRCodeScanner/QRCodeScanner.react';

import { PrivateMeetingWarningModal } from '../PrivateMeetingWarningModal';

export function SelfCheckin({ onClose }) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [privateMeetingQRCodeData, setPrivateMeetingQRCodeData] = useState(
    null
  );

  const handleQRCode = useCallback(
    (qrData, isActivated = false) => {
      if (!qrData) return;
      const filteredQRData = qrData.split(CWA_URL_SPLIT)[0];

      if (filteredQRData.includes(BASE_PRIVATE_MEETING_PATH)) {
        if (isActivated) {
          setPrivateMeetingQRCodeData(null);
        } else {
          setPrivateMeetingQRCodeData(filteredQRData);
          return;
        }

        const [url, data] = (privateMeetingQRCodeData || filteredQRData).split(
          '#'
        );
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
      const urlChunks = filteredQRData.split('/');
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
        .catch(error => {
          const message =
            error instanceof AccountDeletedError
              ? 'accountDeleted'
              : 'invalidQRCode';
          notification.error({
            message: formatMessage({
              id: `QRCodeScanner.error.${message}`,
            }),
          });
        });
    },
    [history, privateMeetingQRCodeData, formatMessage]
  );

  return (
    <>
      <AppContent>
        <QRCodeScanner
          onClose={onClose}
          onScan={privateMeetingQRCodeData ? () => {} : handleQRCode}
          description={formatMessage({ id: 'Home.Scanner.Description' })}
        />
      </AppContent>
      {privateMeetingQRCodeData && (
        <PrivateMeetingWarningModal
          onCancel={() => setPrivateMeetingQRCodeData(false)}
          onCheck={() => handleQRCode(privateMeetingQRCodeData, true)}
        />
      )}
    </>
  );
}
