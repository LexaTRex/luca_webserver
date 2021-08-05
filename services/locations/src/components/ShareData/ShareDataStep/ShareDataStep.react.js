import React from 'react';

import { notification } from 'antd';
import { PrimaryButton } from 'components/general';
import { useIntl } from 'react-intl';

import { shareData } from 'network/api';

import { reencryptAdditionalData, decryptTrace } from 'utils/crypto';
import {
  SubHeader,
  StepLabel,
  RequestContent,
  FinishButtonWrapper,
} from '../ShareData.styled';

import { Checkins } from './Checkins';
import { HealthDepartmentInfo } from './HealthDepartmentInfo';
import { DataRequests } from './DataRequests';

import { InfoText } from './ShareDataStep.styled';

/**
 * This step decrypts the outer encryption layer of the traces requested by
 * the health department for the corresponding locationTransfer process. Any
 * additional data will be re-encrypted with the public key of the responsible
 * health department. The remaining data is still encrypted with the daily key.
 *
 * @see https://www.luca-app.de/securityoverview/processes/tracing_find_contacts.html#process
 */

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
              const decryptedTrace = decryptTrace(trace, privateKey);
              const reencryptedAdditionalData = reencryptAdditionalData(
                trace.additionalData,
                privateKey,
                transfer.department.publicHDEKP
              );

              return {
                traceId: trace.traceId,
                version: decryptedTrace.version,
                keyId: decryptedTrace.keyId,
                publicKey: decryptedTrace.publicKey,
                verification: decryptedTrace.verification,
                data: decryptedTrace.data,
                additionalData: reencryptedAdditionalData,
              };
            } catch (error) {
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

  return (
    <>
      {showStepLabel && <StepLabel>2/2</StepLabel>}

      <RequestContent>
        <SubHeader>
          {intl.formatMessage({ id: 'shareData.shareData' })}
        </SubHeader>
        <InfoText>
          {intl.formatMessage(
            { id: 'shareData.transfersLabel' },
            {
              note: <b>{intl.formatMessage({ id: 'shareData.note' })}</b>,
            }
          )}
        </InfoText>
      </RequestContent>
      <DataRequests transfers={transfers} />
      <Checkins transfers={transfers} />
      <HealthDepartmentInfo transfers={transfers} />
      <FinishButtonWrapper align="flex-end">
        <PrimaryButton data-cy="next" onClick={onFinish}>
          {intl.formatMessage({ id: 'shareData.finish' })}
        </PrimaryButton>
      </FinishButtonWrapper>
    </>
  );
};
