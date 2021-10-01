import React from 'react';
import { notification } from 'antd';
import { useIntl } from 'react-intl';
import { useQuery, useQueryClient } from 'react-query';

import { deleteDevice, getOperatorDevices } from 'network/api';

import { useModal } from 'components/hooks/useModal';
import { ReactivateDeviceModal } from 'components/App/modals/ReactivateDeviceModal';

import {
  DeviceListHeader,
  DeviceListWrapper,
  DeviceListContent,
  DeviceListColumn,
  DeviceListColumnsWrapper,
} from './DeviceList.styled';

import { NoDeviceFound } from './NoDeviceFound';
import { DeviceListItem } from './DeviceListItem';

export function DeviceList() {
  const intl = useIntl();
  const [openModal] = useModal();
  const queryClient = useQueryClient();
  const { data: devices, isError, isLoading } = useQuery(
    'devices',
    getOperatorDevices
  );

  const unknownDeviceName = intl.formatMessage({ id: 'device.unknown' });

  const onReactivate = deviceId => {
    openModal({
      content: <ReactivateDeviceModal deviceId={deviceId} />,
      emphasis: 'noHeader',
    });
  };

  const onDelete = (deviceId, deviceName) => {
    deleteDevice(deviceId)
      .then(() => {
        notification.success({
          message: intl.formatMessage(
            {
              id: 'notification.deviceDeletion.success',
            },
            {
              deviceName: deviceName || unknownDeviceName,
            }
          ),
        });
        queryClient.invalidateQueries('devices');
      })
      .catch(() => {
        queryClient.invalidateQueries('devices');
        notification.error({
          message: intl.formatMessage(
            {
              id: 'notification.deviceDeletion.error',
            },
            {
              deviceName: deviceName || unknownDeviceName,
            }
          ),
        });
      });
  };

  if (isError || isLoading) {
    return null;
  }

  return (
    <DeviceListWrapper>
      <DeviceListHeader>
        {intl.formatMessage({ id: 'device.list' })}
      </DeviceListHeader>
      <DeviceListColumnsWrapper>
        <DeviceListColumn>
          {intl.formatMessage({ id: 'device.list.deviceName' })}
        </DeviceListColumn>
        <DeviceListColumn>
          {intl.formatMessage({ id: 'device.list.status' })}
        </DeviceListColumn>
        <DeviceListColumn>
          {intl.formatMessage({ id: 'device.list.lastActive' })}
        </DeviceListColumn>
        <DeviceListColumn>
          {intl.formatMessage({ id: 'device.list.role' })}
        </DeviceListColumn>
        <DeviceListColumn />
      </DeviceListColumnsWrapper>
      <DeviceListContent>
        {!devices || devices.length === 0 ? (
          <NoDeviceFound />
        ) : (
          devices.map(device => (
            <DeviceListItem
              device={device}
              onDelete={onDelete}
              key={device.deviceId}
              onReactivate={onReactivate}
            />
          ))
        )}
      </DeviceListContent>
    </DeviceListWrapper>
  );
}
