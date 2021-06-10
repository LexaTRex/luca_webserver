import React, { useCallback, useEffect, useState } from 'react';
import { notification } from 'antd';
import moment from 'moment';
import { useIntl } from 'react-intl';

import { indexDB } from 'db';
import {
  StyledContent,
  StyledHeadline,
  StyledInfoText,
  StyledBoldText,
  StyledGuestList,
  StyledContainer,
  StyledCloseButton,
  StyledModalContainer,
} from './HistoryPrivateMeetingInfoModal.styled';

export function HistoryPrivateMeetingInfoModal({
  locationId,
  onClose = () => {},
}) {
  const { formatMessage } = useIntl();
  const [user, setUser] = useState({});
  const [guests, setGuests] = useState([]);
  const [activeMeeting, setActiveMeeting] = useState({});

  const internalIndexedDBError = useCallback(() => {
    notification.error({
      message: formatMessage({
        id: 'IndexedDB.error.transaction',
      }),
    });
  }, [formatMessage]);

  useEffect(() => {
    indexDB.users
      .toArray()
      .then(users => setUser(users[0]))
      .catch(() => internalIndexedDBError());
    indexDB.guests
      .where({ locationId })
      .toArray()
      .then(databaseGuests => setGuests(databaseGuests))
      .catch(() => internalIndexedDBError());
    indexDB.privateLocations
      .where({ locationId })
      .first()
      .then(databasePrivateMeeting => setActiveMeeting(databasePrivateMeeting))
      .catch(() => internalIndexedDBError());
  }, [locationId, internalIndexedDBError]);

  return (
    <StyledModalContainer>
      <StyledContainer>
        <StyledContent>
          <StyledHeadline>
            {formatMessage({ id: 'HistoryPrivateMeetingInfoModal.Headline' })}
          </StyledHeadline>
          <StyledHeadline>
            {`${user.firstName} ${user.lastName}`}
          </StyledHeadline>
          <StyledInfoText>
            {activeMeeting.startedAt &&
              moment.unix(activeMeeting.startedAt).format('DD.MM.YYYY HH.mm')}
            {' - '}
            {activeMeeting.endedAt &&
              moment.unix(activeMeeting.endedAt).format('HH.mm')}{' '}
            Uhr
          </StyledInfoText>
          <StyledGuestList>
            {guests.map((guest, index) => (
              <StyledInfoText key={guest.guestId}>
                <StyledBoldText>{index + 1}.</StyledBoldText> {guest.firstName}{' '}
                {guest.lastName}
              </StyledInfoText>
            ))}
          </StyledGuestList>
        </StyledContent>
        <StyledCloseButton id="closeModal" tabIndex="1" onClick={onClose}>
          {formatMessage({ id: 'Modal.Close' })}
        </StyledCloseButton>
      </StyledContainer>
    </StyledModalContainer>
  );
}
