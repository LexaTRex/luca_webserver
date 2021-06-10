import moment from 'moment';

import {
  base64ToHex,
  int32ToHex,
  VERIFY_EC_SHA256_DER_SIGNATURE,
} from '@lucaapp/crypto';
import { getCurrentDailyKey, getIssuerDetails } from '../network/api';
import {
  ExpiredDailyKeyError,
  InvalidDailyKeySignatureError,
  MissingKeyError,
} from './dailyKeyErrors';
import { indexDB } from '../db';

async function getCurrentDailyKeyWrapper() {
  try {
    return await getCurrentDailyKey();
  } catch (error) {
    if (error.status === 404) throw new MissingKeyError();
    throw error;
  }
}

async function fetchDailyPublicKey() {
  const {
    keyId,
    issuerId,
    publicKey,
    signature,
    createdAt,
  } = await getCurrentDailyKeyWrapper();

  const { publicHDSKP } = await getIssuerDetails(issuerId);

  const isValidSignature = await VERIFY_EC_SHA256_DER_SIGNATURE(
    base64ToHex(publicHDSKP),
    `${int32ToHex(keyId)}${int32ToHex(createdAt)}${base64ToHex(publicKey)}`,
    base64ToHex(signature)
  );

  if (!isValidSignature) {
    throw new InvalidDailyKeySignatureError();
  }

  if (moment.duration(moment().diff(moment.unix(createdAt))).asDays() > 7) {
    throw new ExpiredDailyKeyError();
  }
  return { keyId, publicKey };
}

export async function getDailyPublicKey() {
  const today = moment().format('DD-MM-YYYY');
  const keys = await indexDB.dailyKeys.where({ date: today }).toArray();

  if (keys.length > 0) {
    const { publicKey, keyId } = keys[0];
    return { publicKey, keyId };
  }
  const { keyId, publicKey } = await fetchDailyPublicKey();

  await indexDB.dailyKeys.where('date').notEqual(today).delete();
  await indexDB.dailyKeys.add({ publicKey, date: today, keyId });
  return { publicKey, keyId };
}
