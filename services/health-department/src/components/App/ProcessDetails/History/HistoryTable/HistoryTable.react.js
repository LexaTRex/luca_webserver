import React from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { Table, notification } from 'antd';

import { sortByTimeAsc, formattedTimeLabel } from 'utils/time';
import { sortByNameAsc } from 'utils/string';
import { contactLocation } from 'network/api';

import { useModal } from 'components/hooks/useModal';
import { useLocationTransfers } from 'components/hooks/useLocationTransfers';
import { ContactPersonsModal } from 'components/App/modals/ContactPersonsModal';

import { Time, Contact } from './HistoryTable.styled';
import { ContactConfirmationButton } from './ContactConfirmationButton';

export const HistoryTable = ({ process }) => {
  const intl = useIntl();
  const [openModal] = useModal();
  const queryClient = useQueryClient();
  const locationTransfers = useLocationTransfers(process.uuid);

  if (!locationTransfers) return null;

  const formattedContactInfo = (firstName, lastName) =>
    `${firstName} ${lastName}`;

  const handleAction = locationTransfer => {
    if (locationTransfer.isCompleted) {
      openModal({
        content: (
          <ContactPersonsModal location={locationTransfer} process={process} />
        ),
        wide: true,
      });
    }
    if (!locationTransfer.contactedAt) {
      contactLocation(locationTransfer.transferId)
        .then(() => {
          notification.success({
            message: intl.formatMessage({
              id: 'modal.history.contact.success',
            }),
          });
          queryClient.invalidateQueries([
            'transfers',
            { processId: process.uuid },
          ]);
          queryClient.invalidateQueries([
            'processes',
            { processId: process.uuid },
          ]);
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
      render: function renderContact(locationTransfer) {
        return (
          <>
            <Contact>
              {formattedContactInfo(
                locationTransfer.firstName,
                locationTransfer.lastName
              )}
            </Contact>
            <Contact>{locationTransfer.phone}</Contact>
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
      render: function renderConfirmStatus(locationTransfer) {
        return (
          <ContactConfirmationButton
            location={locationTransfer}
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
          ? sortByTimeAsc(locationTransfers)
          : sortByNameAsc(locationTransfers)
      }
      pagination={false}
      rowKey={record => record.transferId}
    />
  );
};
