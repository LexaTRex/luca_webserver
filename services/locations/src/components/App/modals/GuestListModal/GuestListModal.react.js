import React, { useState } from 'react';

import moment from 'moment';
import { useIntl } from 'react-intl';
import { Spin, notification, Table } from 'antd';
import { useQuery, useQueryClient } from 'react-query';

// Utils
import { sortTraces } from 'utils/sort';
import { base64ToHex } from '@lucaapp/crypto';

// Api
import { getTraces, forceCheckoutSingleTrace } from 'network/api';

// Components
import { DurationFilter, TODAY_OPTION, ALL_OPTION } from './DurationFilter';
import { DeviceIcon } from './DeviceIcon';
import { CheckoutButton } from './CheckoutButton';
import { Wrapper, Count, Header, Loading } from './GuestListModal.styled';

export const GuestListModal = ({ location }) => {
  const intl = useIntl();
  const [duration, setActiveDuration] = useState(TODAY_OPTION);
  const queryClient = useQueryClient();
  const {
    isLoading,
    error,
    data: traces,
  } = useQuery(`traces/${location.uuid}/${duration}`, () =>
    getTraces(location.accessId, duration !== ALL_OPTION ? duration : null)
  );

  const renderCheckoutError = () =>
    notification.error({
      message: intl.formatMessage({
        id: 'notification.checkOut.error',
      }),
    });

  const onCheckoutSingleGuest = traceId => {
    forceCheckoutSingleTrace(traceId)
      .then(response => {
        if (response.status === 204) {
          queryClient.invalidateQueries(`current/${location.scannerId}`);
          queryClient.invalidateQueries(`traces/${location.uuid}/${duration}`);
          notification.success({
            message: intl.formatMessage({
              id: 'notification.checkOut.success',
            }),
            className: 'successCheckout',
          });
        } else {
          renderCheckoutError();
        }
      })
      .catch(() => renderCheckoutError());
  };

  if (isLoading)
    return (
      <Loading>
        <Spin size="large" />
      </Loading>
    );
  if (error) return null;

  const columns = [
    {
      title: intl.formatMessage({ id: 'modal.guestList.deviceType' }),
      key: 'deviceType',
      render: function renderDeviceType(trace) {
        return <DeviceIcon deviceType={trace.deviceType} />;
      },
    },
    {
      title: intl.formatMessage({ id: 'modal.guestList.checkinDate' }),
      key: 'checkinDate',
      render: function renderCheckinDate(trace) {
        return <>{moment.unix(trace.checkin).format('DD.MM.YYYY')}</>;
      },
    },
    {
      title: intl.formatMessage({ id: 'modal.guestList.checkinTime' }),
      key: 'checkinTime',
      render: function renderCheckinTime(trace) {
        return (
          <div data-cy="trackingTime">
            {moment.unix(trace.checkin).format('HH:mm')}
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'modal.guestList.checkoutDate' }),
      key: 'checkoutDate',
      render: function renderCheckinDate(trace) {
        return (
          <>
            {trace.checkout
              ? moment.unix(trace.checkout).format('DD.MM.YYYY')
              : '-'}
          </>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'modal.guestList.checkoutTime' }),
      key: 'checkoutTime',
      render: function renderCheckinTime(trace) {
        return (
          <>
            {trace.checkout ? moment.unix(trace.checkout).format('HH:mm') : '-'}
          </>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'modal.guestList.guest' }),
      key: 'guest',
      render: function renderCheckin(trace) {
        return <>{base64ToHex(trace.traceId)}</>;
      },
    },
    {
      title: intl.formatMessage({
        id: 'group.view.overview.checkout',
      }),
      key: 'checkout',
      render: function renderCheckout(trace) {
        return (
          <CheckoutButton
            trace={trace}
            onCheckoutSingleGuest={onCheckoutSingleGuest}
          />
        );
      },
    },
  ];

  return (
    <Wrapper>
      <Header>
        <Count data-cy="totalCheckinCount">
          {intl.formatMessage(
            { id: 'modal.guestList.count' },
            { count: traces.length }
          )}
        </Count>
        <DurationFilter active={duration} onChange={setActiveDuration} />
      </Header>
      <Table
        columns={columns}
        dataSource={sortTraces(traces)}
        pagination={false}
        rowKey={record => record.traceId}
      />
    </Wrapper>
  );
};
