import React from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { Table, notification } from 'antd';

import { sortByTimeAsc, formattedTimeLabel } from 'utils/time';
import { sortByNameAsc } from 'utils/string';
import { contactLocation } from 'network/api';

import { useModal } from 'components/hooks/useModal';
import { useLocationWithTransfers } from 'components/hooks/useLocationWithTransfers';
import { ContactPersonsModal } from 'components/App/modals/ContactPersonsModal';

import { Time, Contact } from './HistoryTable.styled';
import { ContactConfirmationButton } from './ContactConfirmationButton';

export const HistoryTable = ({ process }) => {
  const intl = useIntl();
  const [openModal] = useModal();
  const queryClient = useQueryClient();
  const locations = useLocationWithTransfers(process.uuid);

  if (!locations) return null;

  const formattedContactInfo = (firstName, lastName) =>
    `${firstName} ${lastName}`;

  const handleAction = location => {
    if (location.isCompleted) {
      openModal({
        content: <ContactPersonsModal location={location} process={process} />,
        wide: true,
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
          queryClient.invalidateQueries(`transfers${process.uuid}`);
          queryClient.invalidateQueries(`process${process.uuid}`);
          queryClient.invalidateQueries('processes');
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
