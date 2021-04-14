import React from 'react';
import moment from 'moment';
import { Button } from 'antd';
import { useIntl } from 'react-intl';

import { BASE_SHARE_DATA_ROUTE } from 'constants/routes';

import { Wrapper, Header } from '../TransferList.styled';

import {
  TransferHeader,
  TransferWrapper,
  TransferContent,
  ContentHeader,
  Content,
  ContentValue,
  ButtonWrapper,
  buttonStyles,
} from './IncompletedDataRequests.styled';

export const IncompletedDataRequests = ({ tracingProcesses }) => {
  const intl = useIntl();

  const openShareDataView = tracingProcessId => {
    window.open(`${BASE_SHARE_DATA_ROUTE}${tracingProcessId}`, '_blank');
  };

  const formatDate = timestamp =>
    `${moment.unix(timestamp).format('DD.MM.YYYY')}`;

  return (
    <Wrapper inComplete>
      <Header>
        <div>
          {intl.formatMessage({
            id: 'dataTransfers.list.inComplete.header',
          })}
        </div>
        <div>{tracingProcesses.length}</div>
      </Header>
      {tracingProcesses.map(tracingProcess => (
        <TransferWrapper key={tracingProcess.tracingProcessId}>
          <TransferHeader>
            <div>{tracingProcess.healthDepartment}</div>
            <div>{formatDate(tracingProcess.createdAt)}</div>
          </TransferHeader>
          <TransferContent>
            <Content
              style={{
                flex: '25%',
                borderRight: '1px solid rgb(151, 151, 151)',
              }}
            >
              <ContentHeader>
                {intl.formatMessage({
                  id: 'dataTransfers.transfer.location',
                })}
              </ContentHeader>
              <ContentValue>
                {tracingProcess.transfers.map(transfer => (
                  <div key={transfer.uuid}>
                    {`${transfer.groupName} - ${
                      transfer.locationName ||
                      intl.formatMessage({ id: 'location.defaultName' })
                    }`}
                  </div>
                ))}
              </ContentValue>
            </Content>
            <Content
              style={{
                flex: '25%',
                borderRight: '1px solid rgb(151, 151, 151)',
              }}
            >
              <ContentHeader>
                {intl.formatMessage({
                  id: 'dataTransfers.transfer.timeFrom',
                })}
              </ContentHeader>
              <ContentValue>
                {formatDate(tracingProcess.timeSpan[0])}
              </ContentValue>
              <ContentValue>
                {`${moment.unix(tracingProcess.timeSpan[0]).format('HH:mm')}`}
              </ContentValue>
            </Content>
            <Content
              style={{
                flex: '25%',
              }}
            >
              <ContentHeader>
                {intl.formatMessage({
                  id: 'dataTransfers.transfer.timeUntil',
                })}
              </ContentHeader>
              <ContentValue>
                {formatDate(tracingProcess.timeSpan[1])}
              </ContentValue>
              <ContentValue>
                {`${moment.unix(tracingProcess.timeSpan[1]).format('HH:mm')}`}
              </ContentValue>
            </Content>
          </TransferContent>
          <ButtonWrapper>
            <Button
              style={buttonStyles}
              onClick={() => openShareDataView(tracingProcess.tracingProcessId)}
            >
              {intl.formatMessage({
                id: 'dataTransfers.transfer.completeRequest',
              })}
            </Button>
          </ButtonWrapper>
        </TransferWrapper>
      ))}
    </Wrapper>
  );
};
