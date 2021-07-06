import { useEffect, useMemo, useState } from 'react';
import { notification } from 'antd';
import { useIntl } from 'react-intl';
import useInterval from '@use-it/interval';

import { generateQRCode } from 'helpers/crypto';
import { isLocalTimeCorrect } from 'helpers/time';

export function useTraceQRCode(users) {
  const intl = useIntl();
  const [qrCode, setQRCode] = useState('');

  useEffect(() => {
    isLocalTimeCorrect()
      .then(isTimeCorrect => {
        if (isTimeCorrect) return;
        notification.error({
          message: intl.formatMessage({
            id: 'error.systemTime',
          }),
        });
      })
      .catch(console.error);
  }, [intl]);

  const generateTraceQRCode = useMemo(() => {
    return async () => {
      try {
        if (users && users[0]?.userId) {
          const [{ userId }] = users;
          setQRCode(await generateQRCode(userId));
        }
      } catch (error) {
        const descriptionId =
          error.descriptionId ?? 'QRCodeGenerator.error.unknown';
        notification.error({
          message: intl.formatMessage({
            id: 'QRCodeGenerator.error.headline',
          }),
          description: intl.formatMessage({
            id: descriptionId,
          }),
        });
      }
    };
  }, [intl, users]);

  /**
   * Refreshes the current check-in qr code every minute.
   * @see https://www.luca-app.de/securityoverview/processes/guest_app_checkin.html#scanner-check-in
   */
  useInterval(generateTraceQRCode, 60000);

  useEffect(() => {
    generateTraceQRCode();
  }, [generateTraceQRCode]);

  return qrCode;
}
