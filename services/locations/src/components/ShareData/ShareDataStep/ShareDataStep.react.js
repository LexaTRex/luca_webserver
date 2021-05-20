import React, { useMemo } from 'react';

import moment from 'moment';
import { notification } from 'antd';
import { useIntl } from 'react-intl';

import { shareData } from 'network/api';
import {
  base64ToHex,
  hexToInt8,
  hexToBase64,
  hexToBytes,
  ENCRYPT_DLIES,
  DECRYPT_DLIES,
} from '@lucaapp/crypto';

import {
  SubHeader,
  StepLabel,
  FinishButton,
  RequestContent,
  FinishButtonWrapper,
} from '../ShareData.styled';

export const ShareDataStep = ({
  privateKey,
  transfers,
  next,
  showStepLabel,
}) => {
  const intl = useIntl();

  const onFinish = async () => {
    await Promise.all(
      transfers.map(async transfer => {
        const traces = transfer.traces
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
                    base64ToHex(transfer.department.publicHDEKP),
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
            locationTransferId: transfer.transferId,
          });
          next();
        } catch {
          notification.error({
            message: intl.formatMessage({
              id: 'notification.shareData.error',
            }),
          });
        }
      })
    );
  };

  const timestampFormat = 'DD.MM.YYYY hh:mm';
  const healthDepartments = useMemo(() => {
    const departments = {};

    if (!transfers) return [];

    for (const transfer of transfers) {
      departments[transfer.department.name] = transfer.department;
    }

    return Object.values(departments);
  }, [transfers]);

  return (
    <>
      {showStepLabel && <StepLabel>2/2</StepLabel>}
      <RequestContent>
        <SubHeader>
          {intl.formatMessage({ id: 'shareData.shareData' })}
        </SubHeader>

        <h4>{intl.formatMessage({ id: 'shareData.transfersLabel' })}</h4>

        {transfers.map(transfer => (
          <h3 key={transfer.transferId}>
            {transfer.location.name}
            <br />
            {` ${moment
              .unix(transfer.time[0])
              .format(timestampFormat)} ${intl.formatMessage({
              id: 'dataTransfers.transfer.timeLabel',
            })} - ${moment
              .unix(transfer.time[1])
              .format(timestampFormat)} ${intl.formatMessage({
              id: 'dataTransfers.transfer.timeLabel',
            })}`}
          </h3>
        ))}
      </RequestContent>

      <RequestContent>
        <h4>{intl.formatMessage({ id: 'shareData.activeCheckIns' })}</h4>

        <h3>
          {transfers.reduce((sum, transfer) => sum + transfer.traces.length, 0)}
        </h3>
      </RequestContent>

      <RequestContent>
        <h4>{intl.formatMessage({ id: 'shareData.inquiringHD' })}</h4>

        {healthDepartments.map(healthDepartment => (
          <h3 key={healthDepartment.name}>{healthDepartment.name}</h3>
        ))}
      </RequestContent>

      <FinishButtonWrapper align="flex-end">
        <FinishButton onClick={onFinish}>
          {intl.formatMessage({ id: 'shareData.finish' })}
        </FinishButton>
      </FinishButtonWrapper>
    </>
  );
};
