import React from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { Button, notification } from 'antd';

import { shareData } from 'network/api';
import {
  base64ToHex,
  hexToInt8,
  hexToBase64,
  hexToBytes,
  ENCRYPT_DLIES,
  DECRYPT_DLIES,
} from '@lucaapp/crypto';

import { IS_MOBILE } from 'constants/environment';

import {
  SubHeader,
  RequestContent,
  FinishButtonWrapper,
} from '../ShareData.styled';

export const ShareDataStep = ({ privateKey, locationTransfer, next }) => {
  const intl = useIntl();

  const onFinish = async () => {
    const traces = locationTransfer.traces
      .map(trace => {
        try {
          const decData = DECRYPT_DLIES(
            privateKey,
            base64ToHex(trace.publicKey),
            base64ToHex(trace.data),
            base64ToHex(trace.iv),
            base64ToHex(trace.mac)
          );
          let additionalData;

          if (trace.additionalData) {
            try {
              const decryptedAdditionaldata = DECRYPT_DLIES(
                privateKey,
                base64ToHex(trace.additionalData.publicKey),
                base64ToHex(trace.additionalData.data),
                base64ToHex(trace.additionalData.iv),
                base64ToHex(trace.additionalData.mac)
              );
              JSON.parse(hexToBytes(decryptedAdditionaldata));
              const encAdditionalData = ENCRYPT_DLIES(
                base64ToHex(locationTransfer.department.publicHDEKP),
                decryptedAdditionaldata
              );
              additionalData = {
                data: hexToBase64(encAdditionalData.data),
                publicKey: hexToBase64(encAdditionalData.publicKey),
                mac: hexToBase64(encAdditionalData.mac),
                iv: hexToBase64(encAdditionalData.iv),
              };
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error('error decrypting additional data', error);
            }
          }

          return {
            traceId: trace.traceId,
            version: hexToInt8(decData.slice(0, 2)),
            keyId: hexToInt8(decData.slice(2, 4)),
            publicKey: hexToBase64(decData.slice(4, 70)),
            verification: hexToBase64(decData.slice(70, 86)),
            data: hexToBase64(decData.slice(86, decData.length)),
            additionalData,
          };
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Trace decryption failed.', trace, error);
          return null;
        }
      })
      .filter(decryptedTrace => decryptedTrace !== null);

    try {
      await shareData({
        traces: { traces },
        locationTransferId: locationTransfer.transferId,
      });
      next();
    } catch {
      notification.error({
        message: intl.formatMessage({
          id: 'notification.shareData.error',
        }),
      });
    }
  };

  const combinedTraces = [];
  locationTransfer.traces.map(trace => combinedTraces.push(trace));

  return (
    <>
      <RequestContent>
        <SubHeader>
          {intl.formatMessage({ id: 'shareData.shareData' })}
        </SubHeader>

        <h4>{intl.formatMessage({ id: 'shareData.timePeriod' })}</h4>
        <h3>{`${moment
          .unix(locationTransfer.time[0])
          .format('DD.MM.YYYY')} - ${moment
          .unix(locationTransfer.time[1])
          .format('DD.MM.YYYY')}`}</h3>
      </RequestContent>

      <RequestContent>
        <SubHeader>
          {intl.formatMessage({ id: 'shareData.activeCheckIns' })}
        </SubHeader>

        <h3>{combinedTraces.length}</h3>
      </RequestContent>

      <FinishButtonWrapper>
        <Button
          onClick={onFinish}
          style={{ height: 40, width: IS_MOBILE ? '100%' : 200 }}
        >
          {intl.formatMessage({ id: 'shareData.finish' })}
        </Button>
      </FinishButtonWrapper>
    </>
  );
};
