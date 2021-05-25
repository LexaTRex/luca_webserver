import React, { useState } from 'react';

import moment from 'moment';
import { useIntl } from 'react-intl';
import { Spin, Popconfirm, notification, Tooltip } from 'antd';
import { useQuery, useQueryClient } from 'react-query';
import {
  MobileOutlined,
  QrcodeOutlined,
  ContainerOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

// Utils
import { sortTraces } from 'utils/sort';
import { base64ToHex } from '@lucaapp/crypto';

// Api
import { getTraces, forceCheckoutSingleTrace } from 'network/api';

// Components
import { DurationFilter, TODAY_OPTION, ALL_OPTION } from './DurationFilter';
import {
  Wrapper,
  GuestTable,
  Entry,
  TableRow,
  Count,
  Header,
  Loading,
  CheckoutButton,
} from './GuestListModal.styled';

function DeviceIcon({ deviceType }) {
  const intl = useIntl();

  if (deviceType === 0 || deviceType === 1 || deviceType === 3) {
    return (
      <Tooltip
        placement="top"
        title={intl.formatMessage({
          id: 'modal.guestlist.deviceType.app',
        })}
      >
        <MobileOutlined />
      </Tooltip>
    );
  }

  if (deviceType === 2) {
    return (
      <Tooltip
        placement="top"
        title={intl.formatMessage({
          id: 'modal.guestlist.deviceType.badge',
        })}
      >
        <QrcodeOutlined />
      </Tooltip>
    );
  }

  return (
    <Tooltip
      placement="top"
      title={intl.formatMessage({
        id: 'modal.guestlist.deviceType.contactForm',
      })}
    >
      <ContainerOutlined />
    </Tooltip>
  );
}

export function GuestListModal({ location }) {
  const intl = useIntl();
  const [duration, setActiveDuration] = useState(TODAY_OPTION);
  const queryClient = useQueryClient();
  const {
    isLoading,
    error,
    data: traces,
  } = useQuery(`traces/${location.uuid}/${duration}`, () =>
    getTraces(
      location.accessId,
      duration !== ALL_OPTION ? duration : null
    ).then(response => response.json())
  );

  const onCheckoutGuestSingle = traceId => {
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
          notification.error({
            message: intl.formatMessage({
              id: 'notification.checkOut.error',
            }),
          });
        }
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'notification.checkOut.error',
          }),
        });
      });
  };

  const setTimeFormat = (checkIn, checkOut) => {
    if (!checkOut) {
      return moment.unix(checkIn).fromNow(true);
    }
    return `${moment.unix(checkIn).format('LT')} - ${moment
      .unix(checkOut)
      .format('LT')}`;
  };

  if (isLoading)
    return (
      <Loading>
        <Spin size="large" />
      </Loading>
    );
  if (error) return null;

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
      {traces.length > 0 && (
        <GuestTable>
          <thead>
            <TableRow borderBottom headline="true">
              <Entry headline="true" tableHeader>
                {intl.formatMessage({ id: 'modal.guestList.deviceType' })}
              </Entry>
              <Entry headline="true" tableHeader>
                {intl.formatMessage({ id: 'modal.guestList.date' })}
              </Entry>
              <Entry headline="true" tableHeader>
                {intl.formatMessage({ id: 'modal.guestList.time' })}
              </Entry>
              <Entry headline="true" tableHeader>
                {intl.formatMessage({ id: 'modal.guestList.guest' })}
              </Entry>
              <Entry headline="true" tableHeader>
                {intl.formatMessage({
                  id: 'group.view.overview.checkout',
                })}
              </Entry>
            </TableRow>
          </thead>
          <tbody>
            {sortTraces(traces).map(trace => (
              <TableRow headline="true" key={trace.traceId}>
                <Entry headline="true">
                  <DeviceIcon deviceType={trace.deviceType} />
                </Entry>
                <Entry headline="true">
                  {moment.unix(trace.checkin).format('DD.MM.YYYY')}
                </Entry>
                <Entry headline="true" data-cy="trackingTime">
                  {setTimeFormat(trace.checkin, trace.checkout)}
                </Entry>
                <Entry headline="true">{base64ToHex(trace.traceId)}</Entry>
                <Entry headline="true">
                  {trace.checkout === null && (
                    <Popconfirm
                      placement="topLeft"
                      onConfirm={() => onCheckoutGuestSingle(trace.traceId)}
                      title={intl.formatMessage({
                        id: 'location.checkout.confirmText',
                      })}
                      okText={intl.formatMessage({
                        id: 'location.checkout.confirmButton',
                      })}
                      cancelText={intl.formatMessage({
                        id: 'location.checkout.declineButton',
                      })}
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    >
                      <CheckoutButton
                        headline="true"
                        data-cy="checkoutGuestSingle"
                      >
                        {intl.formatMessage({
                          id: 'group.view.overview.checkout',
                        })}
                      </CheckoutButton>
                    </Popconfirm>
                  )}
                </Entry>
              </TableRow>
            ))}
          </tbody>
        </GuestTable>
      )}
    </Wrapper>
  );
}
