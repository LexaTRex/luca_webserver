import moment from 'moment';

import { SCAN_TIMEOUT } from 'constants/timeouts';
import { MINIMAL_SUPPORT_VERION } from 'constants/versionSupport';

import { createCheckinV3 } from 'network/api';

import { isLocalTimeCorrect } from 'helpers/time';
import { decode, STATIC_DEVICE_TYPE } from 'utils/qr';

import {
  getV3BadgeCheckinPayload,
  getV4BadgeCheckinPayload,
  getV3AppCheckinPayload,
} from './checkin';

import {
  DECODE_FAILED,
  DUPLICATE_CHECKIN,
  TIMESTAMP_OUTDATED,
  VERSION_NOT_SUPPORTED,
  WRONG_LOCAL_TIME,
  notifyScanError,
} from './errorHandling';

const handleV3StaticData = parameters => {
  const {
    intl,
    scanner,
    setIsSuccess,
    checkForAdditionalData,
    qrData,
  } = parameters;

  const v3BagdePayload = getV3BadgeCheckinPayload(qrData, scanner);

  createCheckinV3(v3BagdePayload)
    .then(response => {
      if (response.status === 409) {
        notifyScanError(DUPLICATE_CHECKIN, intl);
        return;
      }
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, SCAN_TIMEOUT);
      checkForAdditionalData(v3BagdePayload.traceId);
    })
    .catch(error => notifyScanError(error, intl));
};

const handleV3AppData = parameters => {
  const {
    intl,
    scanner,
    setIsSuccess,
    checkForAdditionalData,
    qrData,
  } = parameters;

  // Check that qr code is not older than 5 minutes
  const timestamp = moment().seconds(0);
  if (Math.abs(timestamp.unix() - qrData.timestamp) > 300) {
    notifyScanError(TIMESTAMP_OUTDATED, intl);
    return;
  }

  const v3AppCheckinPayload = getV3AppCheckinPayload(scanner, qrData);

  createCheckinV3(v3AppCheckinPayload)
    .then(response => {
      if (response.status === 409) {
        notifyScanError(DUPLICATE_CHECKIN, intl);
        return;
      }
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, SCAN_TIMEOUT);
      checkForAdditionalData(qrData.traceId);
    })
    .catch(error => notifyScanError(error, intl));
};

const handleV3Data = parameters => {
  const { qrData } = parameters;

  if (qrData.deviceType === STATIC_DEVICE_TYPE) {
    handleV3StaticData(parameters);
    return;
  }
  handleV3AppData(parameters);
};

const handleV4StaticData = async parameters => {
  const {
    intl,
    scanner,
    setIsSuccess,
    checkForAdditionalData,
    qrData,
  } = parameters;

  const v4BadgePayload = await getV4BadgeCheckinPayload(qrData, scanner);
  createCheckinV3(v4BadgePayload)
    .then(response => {
      if (response.status === 409) {
        notifyScanError(DUPLICATE_CHECKIN, intl);
        return;
      }
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, SCAN_TIMEOUT);
      checkForAdditionalData(v4BadgePayload.traceId);
    })
    .catch(error => notifyScanError(error, intl));
};

const handleV4Data = parameters => {
  const { qrData } = parameters;

  if (qrData.deviceType === STATIC_DEVICE_TYPE) {
    handleV4StaticData(parameters);
  }
};

export const handleScanData = async parameters => {
  const { scanData, intl } = parameters;

  if (!scanData) return;
  const qrData = await decode(scanData);

  const parameterPassDown = {
    ...parameters,
    qrData,
  };

  const timeCorrect = await isLocalTimeCorrect();
  if (!timeCorrect) {
    notifyScanError(WRONG_LOCAL_TIME, intl);
    return;
  }

  if (!qrData) {
    notifyScanError(DECODE_FAILED, intl);
    return;
  }

  if (qrData.v < MINIMAL_SUPPORT_VERION) {
    notifyScanError(VERSION_NOT_SUPPORTED, intl);
    return;
  }

  if (qrData.v === 3) {
    handleV3Data(parameterPassDown);
    return;
  }
  if (qrData.v === 4) {
    handleV4Data(parameterPassDown);
    return;
  }

  notifyScanError(VERSION_NOT_SUPPORTED, intl);
};
