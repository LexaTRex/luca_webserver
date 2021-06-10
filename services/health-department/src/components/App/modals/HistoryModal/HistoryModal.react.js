import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useQuery, useQueryClient } from 'react-query';
import { notification } from 'antd';

import { contactLocation, getLocationTransfers } from 'network/api';
import { decryptUserTransfer } from 'utils/cryptoOperations';
import { IncompleteDataError } from 'errors/incompleteDataError';

// Components
import {
  HistoryList,
  HistoryOverviewHeadline,
  HistoryTitle,
  LocationWrapper,
  ModalWrapper,
  Title,
} from './HistoryModal.styled';

import { ContactPersonView } from './ContactPersonView';
import { HistoryModalHeader } from './HistoryModalHeader';
import { InfoRow } from './InfoRow';

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
    data: userData,
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
          queryClient.invalidateQueries('processes');
        })
        .catch(() =>
          notification.error({
            message: intl.formatMessage({ id: 'modal.history.contact.error' }),
          })
        );
    }
  };

  if (isLoading || error || isUserLoading) return null;
  if (userError && !(userError instanceof IncompleteDataError)) return null;

  const locations = data || [];

  const completedLocations = locations.filter(location => location.isCompleted);
  const sortedLocations = locations.sort((a, b) =>
    a.locationName < b.locationName ? -1 : 1
  );

  const historyName = (() => {
    if (!process.userTransferId) {
      return locations?.[0]?.name || '–';
    }
    if (userData) {
      return `${userData.fn} ${userData.ln}`;
    }
    if (userError instanceof IncompleteDataError) {
      return intl.formatMessage({
        id: 'contactPersonTable.unregistredBadgeUser',
      });
    }
    return '–';
  })();

  return (
    <ModalWrapper>
      {openLocation ? (
        <ContactPersonView
          location={openLocation}
          onClose={closeContactWindow}
          contactFromIndexPerson={!!process.userTransferId}
          indexPersonData={userData}
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
          </HistoryOverviewHeadline>
          <HistoryModalHeader
            completed={completedLocations.length}
            total={locations.length}
          />
          <HistoryList>
            {sortedLocations.map(location => (
              <LocationWrapper
                key={`${process.uuid}-${location.locationId}-${location.time[0]}-${location.time[1]}`}
              >
                <InfoRow location={location} callback={handleAction} />
              </LocationWrapper>
            ))}
          </HistoryList>
        </>
      )}
    </ModalWrapper>
  );
};
