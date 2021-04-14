import React, { useCallback, useEffect, useState } from 'react';
import { notification } from 'antd';
import { useIntl } from 'react-intl';
import {
  StyledContent,
  StyledHeadline,
  StyledInfoText,
  StyledContainer,
  StyledCloseButton,
  StyledModalContainer,
} from './PrivateMeetingPeopleModal.styled';
import { indexDB } from '../../../db';

export function PrivateMeetingPeopleModal({ locationId, onClose = () => {} }) {
  const { formatMessage } = useIntl();
  const [guests, setGuests] = useState([]);

  const internalIndexedDBError = useCallback(() => {
    notification.error({
      message: formatMessage({
        id: 'IndexedDB.error.transaction',
      }),
    });
  }, [formatMessage]);

  useEffect(() => {
    indexDB.guests
      .where({ locationId })
      .toArray()
      .then(databaseGuests => setGuests(databaseGuests))
      .catch(() => internalIndexedDBError());
  }, [locationId, internalIndexedDBError]);

  return (
    <StyledModalContainer>
      <StyledContainer>
        <StyledContent>
          <StyledHeadline>
            {formatMessage({ id: 'PrivateMeetingPeopleModal.Headline' })}
          </StyledHeadline>
          {guests.map(guest => (
            <StyledInfoText key={guest.guestId}>
              {guest.firstName} {guest.lastName}
            </StyledInfoText>
          ))}
        </StyledContent>
        <StyledCloseButton onClick={onClose}>
          {formatMessage({ id: 'Modal.Close' })}
        </StyledCloseButton>
      </StyledContainer>
    </StyledModalContainer>
  );
}
