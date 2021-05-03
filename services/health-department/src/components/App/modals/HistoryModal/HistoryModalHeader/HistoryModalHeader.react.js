import React from 'react';
import { useIntl } from 'react-intl';
import { Column, Label, Row } from '../HistoryModal.styled';

export const HistoryModalHeader = ({ completed, total }) => {
  const intl = useIntl();
  return (
    <Row>
      <Column flex="20%">
        <Label>
          {intl.formatMessage({ id: 'history.label.locationName' })}
        </Label>
      </Column>
      <Column flex="10%">
        <Label>
          {intl.formatMessage({ id: 'history.label.locationCategory' })}
        </Label>
      </Column>
      <Column flex="15%">
        <Label>{intl.formatMessage({ id: 'history.label.contactInfo' })}</Label>
      </Column>
      <Column flex="15%">
        <Label>{intl.formatMessage({ id: 'history.label.duration' })}</Label>
      </Column>
      <Column flex="10%">
        <Label>{intl.formatMessage({ id: 'history.label.areaDetails' })}</Label>
      </Column>
      <Column flex="20%" align="flex-end">
        <Label>
          {`${completed}/${total} ${intl.formatMessage({
            id: 'history.confirmed',
          })}`}
        </Label>
      </Column>
    </Row>
  );
};
