import React, { useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { useQuery, useQueryClient } from 'react-query';
import { Button, notification } from 'antd';

import { getLocationTransfers, contactLocation } from 'network/api';
import { decryptUserTransfer } from 'utils/cryptoOperations';

// Components
import {
  ModalWrapper,
  HistoryTitle,
  Title,
  HistoryOverviewHeadline,
  InfoWrapper,
  Location,
  Time,
  HistoryList,
  LocationWrapper,
  contactStyle,
  contactedStyle,
  completedStyle,
} from './HistoryModal.styled';

import { ContactPersonView } from './ContactPersonView';

export const HistoryModal = ({ process }) => {
  const intl = useIntl();
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery(
    'locationTransfer',
    () => getLocationTransfers(process.uuid),
    { refetchOnWindowFocus: false }
  );

  const {
    isLoading: isUserLoading,
    error: userError,
    data: userName,
  } = useQuery(`userTransfer${process.userTransferId}`, () =>
    process.userTransferId ? decryptUserTransfer(process.userTransferId) : {}
  );

  const [openLocation, setOpenLocation] = useState(null);

  const closeContactWindow = useCallback(() => {
    setOpenLocation(null);
  }, []);

  const handleAction = location => {
    if (location.isCompleted) {
      setOpenLocation(location);
    }
    if (!location.contactedAt) {
      contactLocation(location.transferId)
        .then(() => {
          notification.success({
            message: intl.formatMessage({
              id: 'modal.history.contact.success',
            }),
          });
          queryClient.invalidateQueries('locationTransfer');
        })
        .catch(() =>
          notification.error({
            message: intl.formatMessage({ id: 'modal.history.contact.error' }),
          })
        );
    }
  };

  const getRequestStatus = location => {
    if (location.isCompleted) {
      return intl.formatMessage({ id: 'history.confirmed' });
    }
    if (!location.contactedAt) {
      return intl.formatMessage({ id: 'history.contact' });
    }
    return intl.formatMessage({ id: 'history.contacted' });
  };

  if (isLoading || error || isUserLoading || userError) return null;

  const locations = data || [];

  const completedLocations = locations.filter(location => location.isCompleted);
  const sortedLocations = locations.sort((a, b) => b.time[0] - a.time[0]);
  const historyName = process.userTransferId
    ? `${userName.fn} ${userName.ln}`
    : locations[0].name;

  const getButtonStyle = location => {
    if (!location.isCompleted && !!location.contactedAt) {
      return contactedStyle;
    }
    if (location.isCompleted) {
      return completedStyle;
    }
    return contactStyle;
  };

  return (
    <ModalWrapper>
      {openLocation ? (
        <ContactPersonView
          location={openLocation}
          onClose={closeContactWindow}
        />
      ) : (
        <>
          <HistoryTitle>
            <Title>{`${intl.formatMessage({
              id: 'history',
            })} ${historyName}`}</Title>
          </HistoryTitle>
          <HistoryOverviewHeadline>
            <div>{`${locations.length} ${intl.formatMessage({
              id: 'history.locations',
            })}`}</div>
            <div>{`${completedLocations.length}/${
              locations.length
            } ${intl.formatMessage({
              id: 'history.confirmed',
            })}`}</div>
          </HistoryOverviewHeadline>
          <HistoryList>
            {sortedLocations.map(location => (
              <LocationWrapper
                key={`${process.uuid}-${location.locationId}-${location.time[0]}-${location.time[1]}`}
              >
                <InfoWrapper>
                  <Location>{location.name}</Location>
                  <div>{`${intl.formatMessage({
                    id: 'history.contactInformation',
                  })}: ${location.firstName} ${location.lastName} - ${
                    location.phone
                  }`}</div>
                  <Time>
                    {`${moment
                      .unix(location.time[0])
                      .format('DD.MM.YYYY HH:mm')} - ${moment
                      .unix(location.time[1])
                      .format('DD.MM.YYYY HH:mm')}`}
                  </Time>
                </InfoWrapper>
                <Button
                  disabled={!location.isCompleted && !!location.contactedAt}
                  onClick={() => handleAction(location)}
                  style={getButtonStyle(location)}
                >
                  {getRequestStatus(location)}
                </Button>
              </LocationWrapper>
            ))}
          </HistoryList>
        </>
      )}
    </ModalWrapper>
  );
};
