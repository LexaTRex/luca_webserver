/* eslint-disable max-lines, sonarjs/no-duplicate-string, @typescript-eslint/ban-ts-comment */
import config from 'config';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import status from 'http-status';
import { Router } from 'express';

import { ApiError, ApiErrorType } from 'utils/apiError';

import database from 'database/models';
import {
  validateSchema,
  validateParametersSchema,
} from 'middlewares/validateSchema';
import { handle500 } from 'middlewares/error';
import { requireOperator } from 'middlewares/requireUser';
import { requireOperatorDeviceEnabled } from 'middlewares/requireEnabledFeature';

import {
  deviceSchema,
  deviceCreationSchema,
  deviceActivationSchema,
  deviceIdParametersSchema,
} from './operatorDevices.schemas';
import { getOperatorDeviceDTO } from './operatorDevices.helper';

const router = Router();

router.post(
  '/',
  requireOperator,
  requireOperatorDeviceEnabled,
  validateSchema(deviceCreationSchema),
  async (request, response) => {
    const { body, user } = request;

    const { role } = body;
    const { uuid: operatorId } = user as IOperator;

    const device = await database.OperatorDevice.create({
      role,
      operatorId,
      refreshedAt: moment(),
    });

    const refreshToken = jwt.sign(
      { deviceId: device.uuid },
      config.get('keys.operatorDevice.privateKey'),
      {
        algorithm: 'ES256',
        expiresIn: config.get('keys.operatorDevice.expire'),
      }
    );

    return response.send({ ...getOperatorDeviceDTO(device), refreshToken });
  }
);

router.get(
  '/',
  requireOperator,
  requireOperatorDeviceEnabled,
  async (request, response) => {
    const { uuid: operatorId } = request.user as IOperator;
    const devices = await database.OperatorDevice.findAll({
      where: { operatorId },
    });

    return response.send(
      // @ts-ignore - Sequelize models are not typed
      devices.map(device => getOperatorDeviceDTO(device))
    );
  }
);

router.get(
  '/:deviceId',
  requireOperator,
  requireOperatorDeviceEnabled,
  validateParametersSchema(deviceIdParametersSchema),
  async (request, response) => {
    const { user, params } = request;
    const { uuid: operatorId } = user as IOperatorDevice;
    const device = await database.OperatorDevice.findOne({
      where: {
        operatorId,
        uuid: params.deviceId,
      },
    });

    return response.send(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getOperatorDeviceDTO(device)
    );
  }
);

router.post(
  '/:deviceId/reactivate',
  requireOperator,
  requireOperatorDeviceEnabled,
  validateParametersSchema(deviceIdParametersSchema),
  async (request, response) => {
    const { user, params } = request;
    const { uuid: operatorId } = user as IOperatorDevice;
    const device = await database.OperatorDevice.findOne({
      where: {
        operatorId,
        uuid: params.deviceId,
      },
    });

    if (!device) {
      throw new ApiError(ApiErrorType.DEVICE_NOT_FOUND);
    }

    const isDeviceExpired =
      moment(device.refreshedAt).unix() <
      moment()
        .subtract(config.get('keys.operatorDevice.expire'), 'milliseconds')
        .unix();

    if (device.activated && !isDeviceExpired) {
      throw new ApiError(ApiErrorType.FORBIDDEN);
    }

    device.update({
      reactivatedAt: moment(),
    });

    const refreshToken = jwt.sign(
      { deviceId: device.uuid },
      config.get('keys.operatorDevice.privateKey'),
      {
        algorithm: 'ES256',
        expiresIn: config.get('keys.operatorDevice.expire'),
      }
    );

    return response.send({ ...getOperatorDeviceDTO(device), refreshToken });
  }
);

router.post(
  '/activate',
  validateSchema(deviceActivationSchema),
  async (request, response) => {
    passport.authenticate(
      'jwt-operatorDevice',
      { session: false },
      async (error, user) => {
        try {
          const { body } = request;
          if (error) {
            if (error.errorType === 'DEVICE_EXPIRED') {
              throw new ApiError(ApiErrorType.DEVICE_EXPIRED);
            }

            throw new ApiError(ApiErrorType.UNAUTHORIZED);
          }

          if (!user) {
            throw new ApiError(ApiErrorType.UNAUTHORIZED);
          }

          const device = await database.OperatorDevice.findOne({
            where: {
              activated: false,
              uuid: user.deviceId,
            },
          });

          if (!device) {
            throw new ApiError(ApiErrorType.DEVICE_NOT_FOUND);
          }

          if (
            moment(device.refreshedAt).unix() <
            moment()
              .subtract(
                config.get('luca.operatorDevice.unactivated.maxAgeMinutes'),
                'minutes'
              )
              .unix()
          ) {
            throw new ApiError(ApiErrorType.DEVICE_EXPIRED);
          }

          const refreshToken = jwt.sign(
            { deviceId: device.uuid },
            config.get('keys.operatorDevice.privateKey'),
            {
              algorithm: 'ES256',
              expiresIn: config.get('keys.operatorDevice.expire'),
            }
          );

          await device.update({
            activated: true,
            os: body.os,
            name: body.name,
            refreshedAt: moment(),
          });

          request.logIn(user, loginError => {
            if (loginError) {
              throw new ApiError(ApiErrorType.UNAUTHORIZED);
            }

            response.send({
              ...getOperatorDeviceDTO(device),
              refreshToken,
            });
          });
        } catch (authorizationError) {
          handle500(authorizationError, request, response);
        }
      }
    )(request, response);
  }
);

router.patch(
  '/:deviceId',
  requireOperator,
  requireOperatorDeviceEnabled,
  validateSchema(deviceSchema),
  validateParametersSchema(deviceIdParametersSchema),
  async (request, response) => {
    const user = request.user as IOperator;
    const device = await database.OperatorDevice.findOne({
      where: {
        activated: true,
        operatorId: user.uuid,
        uuid: request.params.deviceId,
      },
    });

    if (!device) {
      throw new ApiError(ApiErrorType.DEVICE_NOT_FOUND);
    }

    const { os, name } = request.body;
    await device.update({
      os: os || device.os,
      name: name || device.name,
    });

    return response.status(status.NO_CONTENT);
  }
);

router.delete(
  '/:deviceId',
  requireOperator,
  requireOperatorDeviceEnabled,
  validateParametersSchema(deviceIdParametersSchema),
  async (request, response) => {
    const { user, params } = request;
    const { uuid: operatorId } = user as IOperator;
    const device = await database.OperatorDevice.findOne({
      where: {
        operatorId,
        uuid: params.deviceId,
      },
    });

    if (!device) {
      throw new ApiError(ApiErrorType.DEVICE_NOT_FOUND);
    }

    await device.destroy();
    return response.sendStatus(status.NO_CONTENT);
  }
);

export default router;
