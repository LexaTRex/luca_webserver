import React from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { Button, Popconfirm, notification } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { forceCheckoutUsers } from 'network/api';

import { GuestList } from './GuestList';
import { TableAllocation } from './TableAllocation';
import { Count } from './Count';

import {
  Info,
  GuestHeader,
  InfoWrapper,
  buttonStyles,
  GuestWrapper,
  LinkWrapper,
} from './LocationOverview.styled';
import { LocationCard } from '../LocationCard';

export const LocationOverview = ({ location }) => {
  const intl = useIntl();
  const queryClient = useQueryClient();

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
              <Button data-cy="checkoutGuest" style={buttonStyles}>
                {intl.formatMessage({ id: 'group.view.overview.checkout' })}
              </Button>
            </Popconfirm>
          </div>
        </InfoWrapper>
      </GuestWrapper>
    </LocationCard>
  );
};
