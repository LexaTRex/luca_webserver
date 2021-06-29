import React from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { useQuery, useQueryClient } from 'react-query';
import { Table, notification } from 'antd';

import { sortByTimeAsc } from 'utils/time';
import { sortByNameAsc } from 'utils/string';
import { getLocationTransfers, contactLocation } from 'network/api';

import { useModal } from 'components/hooks/useModal';
import { ContactPersonViewModal } from 'components/App/modals/ContactPersonViewModal';

import { Time, Contact } from './HistoryTable.styled';
import { ContactConfirmationButton } from './ContactConfirmationButton';

export const HistoryTable = ({ process, refetch }) => {
  const intl = useIntl();
  const [openModal] = useModal();
  const queryClient = useQueryClient();
  const { isLoading, error, data: locations } = useQuery(
    'locationTransfer',
    () => getLocationTransfers(process.uuid),
    { refetchOnWindowFocus: false }
  );

  if (isLoading || error) return null;

  const formattedTimeLabel = (timestamp, format = 'DD.MM.YYYY - HH:mm') => {
    return `${moment.unix(timestamp).format(format)}`;
  };

  const formattedContactInfo = (firstName, lastName) =>
    `${firstName} ${lastName}`;

  const handleAction = location => {
    if (location.isCompleted) {
      openModal({
        title: intl.formatMessage({
          id: 'modal.registerHealthDepartment.title',
        }),
        content: (
          <ContactPersonViewModal location={location} process={process} />
        ),
      });
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
          refetch();
        })
        .catch(() =>
          notification.error({
            message: intl.formatMessage({ id: 'modal.history.contact.error' }),
          })
        );
    }
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'history.label.locationName' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'history.label.locationCategory' }),
      dataIndex: 'type',
      key: 'type',
      render: function renderType(type) {
        return (
          <>
            {intl.formatMessage({
              id: `history.location.category.${type}`,
            })}
          </>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'history.label.contactInfo' }),

      key: 'contactInfo',
      render: function renderContact(location) {
        return (
          <>
            <Contact>
              {formattedContactInfo(location.firstName, location.lastName)}
            </Contact>
            <Contact>{location.phone}</Contact>
          </>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'history.label.duration' }),
      key: 'time',
      dataIndex: 'time',
      render: function renderTime(time) {
        return (
          <>
            <Time>{formattedTimeLabel(time[0])}</Time>
            <Time>{formattedTimeLabel(time[1])}</Time>
          </>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'history.label.areaDetails' }),
      key: 'isIndoor',
      dataIndex: 'isIndoor',
      render: function renderIsIndoor(isIndoor) {
        return (
          <>
            {isIndoor
              ? intl.formatMessage({ id: 'history.label.indoor' })
              : intl.formatMessage({ id: 'history.label.outdoor' })}
          </>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'history.label.confirmStatus' }),
      key: 'confirmStatus',
      render: function renderConfirmStatus(location) {
        return (
          <ContactConfirmationButton
            location={location}
            callback={handleAction}
          />
        );
      },
    },
  ];

  return (
    <Table
      id="processDetailsHistoryTable"
      columns={columns}
      dataSource={
        process.userTransferId
          ? sortByTimeAsc(locations)
          : sortByNameAsc(locations)
      }
      pagination={false}
      rowKey={record => record.transferId}
    />
  );
};
