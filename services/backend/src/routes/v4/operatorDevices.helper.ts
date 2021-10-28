import moment from 'moment';
import config from 'config';
import { OperatorDeviceInstance } from 'database/models/operatorDevice';

export const getOperatorDeviceDTO = (device: OperatorDeviceInstance) => ({
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
