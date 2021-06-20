import React from 'react';
import { useIntl } from 'react-intl';

import { CreationDate } from '../../Tracking/TrackingList/Table/Entry/CreationDate';
import { SelectAssignee } from '../../Tracking/TrackingList/Table/Entry/SelectAssignee';
import { CheckDone } from '../../Tracking/TrackingList/Table/Entry/CheckDone';
import { Wrapper, Title, Value, AttributeWrapper } from './InfoRow.styled';

export const InfoRow = ({ process }) => {
  const intl = useIntl();
  return (
    <Wrapper>
      <AttributeWrapper>
        <Title>{intl.formatMessage({ id: 'processTable.description' })}</Title>
        <Value>
          {process.userTransferId
            ? intl.formatMessage({ id: 'processTable.person' })
            : intl.formatMessage({ id: 'processTable.location' })}
        </Value>
      </AttributeWrapper>
      <AttributeWrapper>
        <Title> {intl.formatMessage({ id: 'processTable.createdAt' })}</Title>
        <Value>
          <CreationDate createdAt={process.createdAt} />
        </Value>
      </AttributeWrapper>
      <AttributeWrapper>
        <Title> {intl.formatMessage({ id: 'processTable.assignee' })}</Title>
        <Value>
          <SelectAssignee process={process} />
        </Value>
      </AttributeWrapper>
      <AttributeWrapper>
        <Title>{intl.formatMessage({ id: 'processTable.status' })}</Title>
        <Value>
          <CheckDone status={process.status} />
        </Value>
      </AttributeWrapper>
    </Wrapper>
  );
};
