import moment from 'moment';
import { notification } from 'antd';
import { hexToUuid4 } from '@lucaapp/crypto';

import { SCAN_TIMEOUT } from 'constants/timeouts';
import { MINIMAL_SUPPORT_VERION } from 'constants/versionSupport';

import { createCheckinV3 } from 'network/api';

import { isLocalTimeCorrect } from 'helpers/time';
import { decode, STATIC_DEVICE_TYPE } from 'utils/qr';
import { reloadFilter, bloomFilterContainsUUID } from 'utils/bloomFilter';

import {
  getV4BadgeRawUserId,
  getV4BadgeCheckinPayload,
  getV3AppCheckinPayload,
} from './checkin';

import {
  DECODE_FAILED,
  DUPLICATE_CHECKIN,
  TIMESTAMP_OUTDATED,
  VERSION_NOT_SUPPORTED,
  NO_USER_DATA,
  WRONG_LOCAL_TIME,
  notifyScanError,
} from './errorHandling';

/**
 * The scan of a version 3 badge qr code to create a check-in for the user is denied starting 1.9.21.
 *
 * @see https://www.luca-app.de/securityoverview/badge/check_in.html
 */
const handleV3StaticData = parameters => {
  const { intl } = parameters;

  notification.error({
    message: intl.formatMessage({
      id: 'error.badgeV3Unsupported',
    }),
  });
};

/**
 * Handles the scan of a version 3 app qr code to create a check-in for the user.
 *
 * @see https://www.luca-app.de/securityoverview/processes/guest_app_checkin.html#qr-code-scanning-validation-and-check-in-upload
 */
const handleV3AppData = parameters => {
  const {
    intl,
    scanner,
    setIsSuccess,
    checkForAdditionalData,
    qrData,
    refetch,
  } = parameters;

  // Check that qr code is not older than 5 minutes
  const timestamp = moment().seconds(0);
  if (Math.abs(timestamp.unix() - qrData.timestamp) > 300) {
    notifyScanError(TIMESTAMP_OUTDATED, intl);
    return;
  }

  const v3AppCheckinPayload = getV3AppCheckinPayload(scanner, qrData);

  createCheckinV3(scanner.scannerAccessId, v3AppCheckinPayload)
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
      refetch();
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

/**
 * Handles the scan of a version 4 badge qr code to create a check-in for the user.
 *
 * @see https://www.luca-app.de/securityoverview/badge/check_in.html
 */
const handleV4StaticData = async parameters => {
  const {
    intl,
    scanner,
    setIsSuccess,
    checkForAdditionalData,
    qrData,
    refetch,
  } = parameters;

  const uuid = hexToUuid4(await getV4BadgeRawUserId(qrData));
  if (bloomFilterContainsUUID(uuid)) {
    notifyScanError(NO_USER_DATA, intl);
    reloadFilter(true);
    return;
  }

  const v4BadgePayload = await getV4BadgeCheckinPayload(qrData, scanner);
  createCheckinV3(scanner.scannerAccessId, v4BadgePayload)
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
      refetch();
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
