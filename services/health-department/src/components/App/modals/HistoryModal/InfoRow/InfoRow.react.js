import React from 'react';
import { useIntl } from 'react-intl';
import {
  formattedContactInfo,
  formattedTimeLabel,
} from '../HistoryModal.helper';
import {
  Column,
  Contact,
  InfoWrapper,
  Row,
  Time,
} from '../HistoryModal.styled';
import { ContactConfirmationButton } from './ContactConfirmationButton';

export const InfoRow = ({ location, callback }) => {
  const intl = useIntl();

  return (
    <InfoWrapper>
      <Row>
        <Column flex="20%">{location.name}</Column>
        <Column flex="10%">
          {intl.formatMessage({
            id: `history.location.category.${location.type}`,
          })}
        </Column>
        <Column flex="15%" wrap="wrap">
          <Contact>
            {formattedContactInfo(location.firstName, location.lastName)}
          </Contact>
          <Contact>{location.phone}</Contact>
        </Column>
        <Column flex="15%" wrap="wrap">
          <Time>{formattedTimeLabel(location.time[0])}</Time>
          <Time>{formattedTimeLabel(location.time[1])}</Time>
        </Column>
        <Column flex="10%">
          {location.isIndoor
            ? intl.formatMessage({ id: 'history.label.indoor' })
            : intl.formatMessage({ id: 'history.label.outdoor' })}
        </Column>
        <Column flex="20%" align="flex-end">
          <ContactConfirmationButton location={location} callback={callback} />
        </Column>
      </Row>
    </InfoWrapper>
  );
};
