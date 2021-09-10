import React from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { notification } from 'antd';

// Api
import { getAuditLog, getEmployees } from 'network/api';

import { SecondaryButton } from 'components/general';
import { FILES } from './DownloadFiles';

import {
  Wrapper,
  StyledHeadline,
  StyledInfo,
  ButtonWrapper,
} from './AuditLogsDownloads.styled';

export const AuditLogsDownloads = () => {
  const intl = useIntl();

  const { isLoading, error, data: employees } = useQuery(
    'getAllEmployees',
    () => getEmployees(true),
    { refetchOnWindowFocus: false }
  );

  const downloadLogFile = logData => {
    const blob = new Blob([logData], { type: 'text' });
    const element = window.document.createElement('a');
    element.href = window.URL.createObjectURL(blob);
    element.download = `${intl.formatMessage({
      id: 'auditlogDownload.filename',
    })}.log-file`;
    document.body.append(element);
    element.click();
    element.remove();
  };

  const getLogs = () => {
    const startTime = moment().unix();
    const endTime = moment().subtract(1, 'years').unix();

    getAuditLog({ timeframe: [startTime, endTime] })
      .then(response => {
        downloadLogFile(response);
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'notification.auditlogDownload.error',
          }),
        });
      });
  };

  if (isLoading || error) return null;

  return (
    <Wrapper>
      <StyledHeadline>
        {intl.formatMessage({ id: 'profile.auditLogs.headline' })}
      </StyledHeadline>
      <StyledInfo>
        {intl.formatMessage({ id: 'profile.auditLogs.info' })}
      </StyledInfo>
      <ButtonWrapper>
        <SecondaryButton onClick={getLogs} style={{ marginBottom: 24 }}>
          {intl.formatMessage({ id: 'profile.auditLogs.downloadAuditLog' })}
        </SecondaryButton>
        <FILES.EmailToUuidListDownload employees={employees} />
      </ButtonWrapper>
    </Wrapper>
  );
};
