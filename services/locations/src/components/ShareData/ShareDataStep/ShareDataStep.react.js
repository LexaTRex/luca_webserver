import React, { useMemo } from 'react';

import moment from 'moment';
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
        <PrimaryButton data-cy="next" onClick={onFinish}>
          {intl.formatMessage({ id: 'shareData.finish' })}
        </PrimaryButton>
      </FinishButtonWrapper>
    </>
  );
};
