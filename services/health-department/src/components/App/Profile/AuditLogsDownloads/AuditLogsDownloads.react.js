import React from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

// Api
import { getEmployees } from 'network/api';

import { SecondaryButton } from 'components/general';
import { FILES } from './DownloadFiles';

import {
  Wrapper,
  StyledHeadline,
  StyledInfo,
  ButtonWrapper,
} from './AuditLogsDownloads.styled';

const getDownloadLink = (startTime, endTime) =>
  `/api/v4/healthDepartments/auditlog/download/?timeframe[0]=${startTime}&timeframe[1]=${endTime}`;

export const AuditLogsDownloads = () => {
  const intl = useIntl();

  const { isLoading, error, data: employees } = useQuery(
    'getAllEmployees',
    () => getEmployees(true),
    { refetchOnWindowFocus: false }
  );

  const getLogs = () => {
    const startTime = moment().unix();
    const endTime = moment().subtract(1, 'years').unix();
    window.open(getDownloadLink(startTime, endTime), '_self');
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
