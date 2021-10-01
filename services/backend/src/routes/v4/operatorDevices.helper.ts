import moment from 'moment';
import config from 'config';

export const getOperatorDeviceDTO = (device: {
  uuid: string;
  os: string;
  name: string;
  role: string;
  activated: boolean;
  refreshedAt: number;
}) => ({
  os: device.os,
  name: device.name,
  role: device.role,
  deviceId: device.uuid,
  activated: device.activated,
  refreshedAt: device.refreshedAt,
  isExpired:
    moment(device.refreshedAt).unix() <
    moment()
      .subtract(config.get('keys.operatorDevice.expire'), 'milliseconds')
      .unix(),
});
