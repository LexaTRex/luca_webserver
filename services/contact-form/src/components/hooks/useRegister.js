import { useIntl } from 'react-intl';
import moment from 'moment';
import { notification } from 'antd';

import { createCheckinV3, createUser, addCheckinData } from 'network/api';

import { EC_KEYPAIR_GENERATE, GET_RANDOM_BYTES } from '@lucaapp/crypto';

import {
  getUserIdPayload,
  getV3CheckinPayload,
  getAdditionalDataPayload,
  getTraceId,
} from './useRegister.helper';

export const useRegister = (
  formReference,
  fieldMap,
  clearFormMap,
  scanner = null,
  dailyKey
) => {
  const intl = useIntl();

  const getAdditionalDataFromValues = values => {
    const additionalData = {};
    Object.keys(values)
      .filter(value => value.startsWith('additionalData-'))
      .forEach(key => {
        additionalData[key.replace('additionalData-', '')] = values[key];
      });
    return additionalData;
  };

  return async () => {
    const formValues = formReference.current.getFieldsValue();
    const values = {
      firstName: formValues[fieldMap.firstName],
      lastName: formValues[fieldMap.lastName],
      phone: formValues[fieldMap.phone],
      email: formValues[fieldMap.email],
      street: formValues[fieldMap.street],
      number: formValues[fieldMap.number],
      zip: formValues[fieldMap.zip],
      city: formValues[fieldMap.city],
    };
    const userDataSecret = GET_RANDOM_BYTES(16);
    const userTracingSecret = GET_RANDOM_BYTES(16);
    const userKeypair = EC_KEYPAIR_GENERATE();

    const createUserIdPayload = getUserIdPayload(
      values,
      userDataSecret,
      userKeypair
    );

    try {
      const { userId } = await createUser(createUserIdPayload);

      const timestamp = moment().seconds(0).unix();
      const traceId = getTraceId(userId, userTracingSecret, timestamp);
      const v3checkinPayload = getV3CheckinPayload(
        userId,
        dailyKey,
        userDataSecret,
        scanner,
        timestamp,
        traceId
      );
      await createCheckinV3(v3checkinPayload);
      // CHECKIN SUCCESS
      if (formReference.current) {
        clearFormMap();
        formReference.current.resetFields();
      }

      notification.success({
        message: intl.formatMessage({
          id: 'notification.checkIn.success',
        }),
      });
      // ADD ADDITIONAL INFOS
      const additionalData = getAdditionalDataFromValues(formValues);
      if (values.table) {
        additionalData.table = values.table;
      }

      if (Object.keys(additionalData).length > 0) {
        const additionalDataPayload = getAdditionalDataPayload(
          scanner,
          traceId,
          additionalData
        );

        addCheckinData(additionalDataPayload);
      }
    } catch {
      notification.error({
        message: intl.formatMessage({
          id: 'notification.checkIn.error',
        }),
      });
    }
  };
};
