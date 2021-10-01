import React from 'react';
import moment from 'moment';
import { Popconfirm } from 'antd';
import { useIntl } from 'react-intl';

import {
  DeviceValue,
  DeleteDeviceAction,
  DeviceListItemWrapper,
  ReactivateDeviceAction,
} from './DeviceListItem.styled';

export function DeviceListItem({ device, onReactivate, onDelete }) {
  const intl = useIntl();
  const unknownDeviceName = intl.formatMessage({ id: 'device.unknown' });

  return (
    <DeviceListItemWrapper>
      <DeviceValue>{device.name || unknownDeviceName}</DeviceValue>
      <DeviceValue>
        {intl.formatMessage({
          id: device.activated ? 'device.active' : 'device.unactive',
        })}
      </DeviceValue>
      <DeviceValue>
        {moment(device.refreshedAt).format('DD.MM.YYYY')}
      </DeviceValue>
      <DeviceValue>
        {intl.formatMessage({
          id: `device.role.${device.role}`,
        })}
      </DeviceValue>
      <DeviceValue>
        {device.isExpired && (
          <ReactivateDeviceAction onClick={() => onReactivate(device.deviceId)}>
            {intl.formatMessage({ id: 'device.list.reactivate' })}
          </ReactivateDeviceAction>
        )}
        <Popconfirm
          placement="left"
          onConfirm={() => onDelete(device.deviceId, device.name)}
          title={intl.formatMessage(
            {
              id: 'device.list.delete.confirmation',
            },
            {
              deviceName: device.name || unknownDeviceName,
            }
          )}
          okText={intl.formatMessage({
            id: 'device.list.delete.confirmButton',
          })}
          cancelText={intl.formatMessage({
            id: 'device.list.delete.declineButton',
          })}
        >
          <DeleteDeviceAction>
            {intl.formatMessage({ id: 'device.list.delete' })}
          </DeleteDeviceAction>
        </Popconfirm>
      </DeviceValue>
    </DeviceListItemWrapper>
  );
}
