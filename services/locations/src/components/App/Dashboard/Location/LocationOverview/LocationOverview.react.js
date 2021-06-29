import React from 'react';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { useQuery, useQueryClient } from 'react-query';
import { Button, notification, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { forceCheckoutUsers, getCurrentCount } from 'network/api';

import { GuestList } from './GuestList';
import { TableAllocation } from './TableAllocation';
import { Count } from './Count';

import {
  checkoutButton,
  disabledStyle,
  GuestHeader,
  GuestWrapper,
  Info,
  InfoWrapper,
  LinkWrapper,
} from './LocationOverview.styled';
import { LocationCard } from '../LocationCard';

export const LocationOverview = ({ location }) => {
  const intl = useIntl();
  const queryClient = useQueryClient();

  const { data: currentCount, isLoading: isCurrentLoading } = useQuery(
    `current/${location.scannerId}`,
    () => getCurrentCount(location.scannerAccessId),
    {
      refetchInterval: moment.duration('5', 'minutes').as('ms'),
      onError: () => {
        const message = intl.formatMessage({ id: 'location.count.error' });
        notification.error({ message });
      },
    }
  );

  const checkoutDisabled = !isCurrentLoading && currentCount === 0;

  const onCheckout = () => {
    forceCheckoutUsers(location.uuid)
      .then(response => {
        if (response.status === 204) {
          queryClient.invalidateQueries('groups');
          queryClient.invalidateQueries(`current/${location.scannerId}`);

          notification.success({
            message: intl.formatMessage({
              id: 'notification.checkOut.success',
            }),
            className: 'successCheckout',
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

  return (
    <LocationCard title={intl.formatMessage({ id: 'group.view.overview' })}>
      <GuestWrapper>
        <GuestHeader>
          {intl.formatMessage({ id: 'group.view.overview.guests' })}
        </GuestHeader>
        <InfoWrapper>
          <Info>
            <Count location={location} />
            <LinkWrapper>
              <GuestList location={location} />
              <TableAllocation location={location} />
            </LinkWrapper>
          </Info>
          <div>
            <Popconfirm
              placement="topLeft"
              onConfirm={onCheckout}
              disabled={checkoutDisabled}
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
              <Button
                data-cy="checkoutGuest"
                style={{
                  ...checkoutButton,
                  ...(checkoutDisabled && disabledStyle),
                }}
                disabled={checkoutDisabled}
              >
                {intl.formatMessage({ id: 'group.view.overview.checkout' })}
              </Button>
            </Popconfirm>
          </div>
        </InfoWrapper>
      </GuestWrapper>
    </LocationCard>
  );
};
