/* eslint-disable promise/no-callback-in-promise */
const config = require('config');
const moment = require('moment');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');

const database = require('../database');

const operatorDeviceStrategy = new JWTStrategy(
  {
    algorithms: ['ES256'],
    secretOrKey: config.get('keys.operatorDevice.publicKey'),
    jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
  },
  async (jwtPayload, done) => {
    try {
      const device = await database.OperatorDevice.findOne({
        where: {
          uuid: jwtPayload.deviceId,
        },
        include: {
          model: database.Operator,
          where: {
            activated: true,
          },
        },
      });

      if (!device || jwtPayload.iat < moment(device.refreshedAt).unix()) {
        return done({ errorType: 'DEVICE_NOT_FOUND' }, false);
      }

      const isReactivationOfDeviceToOld =
        moment(device.reactivatedAt).unix() <
        moment()
          .subtract(
            config.get('keys.operatorDevice.maxReactivationAge'),
            'milliseconds'
          )
          .unix();

      const isDeviceExpired =
        moment(device.refreshedAt).unix() <
        moment()
          .subtract(config.get('keys.operatorDevice.expire'), 'milliseconds')
          .unix();

      if (
        isDeviceExpired &&
        (!device.reactivatedAt || isReactivationOfDeviceToOld)
      ) {
        return done({ errorType: 'DEVICE_EXPIRED' }, false);
      }

      const user = {
        type: 'OperatorDevice',
        deviceId: device.uuid,
        uuid: device.Operator.uuid,
        activated: device.activated,
      };
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
);
module.exports = operatorDeviceStrategy;
