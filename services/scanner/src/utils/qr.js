import {
  SHA256,
  z85ToBytes,
  bytesToHex,
  hexToUuid4,
  HKDF_SHA256,
  base64ToHex,
  bytesToBuffer,
  bytesToBase64,
  VERIFY_EC_SHA256_DER_SIGNATURE,
  VERIFY_EC_SHA256_IEEE_SIGNATURE,
  base32ToHex,
  hexToBytes,
} from '@lucaapp/crypto';
import {
  BADGE_SIGNATURE_PUBLIC_KEY_BASE64_V3,
  BADGE_SIGNATURE_PUBLIC_KEY_BASE64_V4,
} from 'constants/keys';

import { convertDELayoutToUSLayout } from './layout';

export const STATIC_DEVICE_TYPE = 2;

// the buffer needs to be advanced by one byte
function parsePayloadV3(buffer, decodedBytes) {
  const deviceType = buffer.getByte();

  if (deviceType === STATIC_DEVICE_TYPE) {
    const keyId = buffer.getByte();
    const tracingSeed = bytesToBase64(buffer.getBytes(16));
    const data = bytesToBase64(buffer.getBytes(32));
    const publicKey = bytesToBase64(buffer.getBytes(33));
    const signatureLength = buffer.getByte();
    const signature = bytesToBase64(buffer.getBytes(signatureLength));
    const paddingLength = buffer.getByte();
    // skip padding
    buffer.getBytes(paddingLength);
    const checksum = bytesToHex(buffer.getBytes(4));

    // checksum check
    const bufferData = bytesToHex(decodedBytes).slice(
      0,
      decodedBytes.length * 2 - 8
    );
    const checksumCheck = SHA256(bufferData).slice(0, 8);
    if (checksumCheck !== checksum) {
      return null;
    }

    // signature check
    const isSignatureValid = VERIFY_EC_SHA256_DER_SIGNATURE(
      base64ToHex(BADGE_SIGNATURE_PUBLIC_KEY_BASE64_V3),
      base64ToHex(data),
      base64ToHex(signature)
    );

    if (!isSignatureValid) {
      return null;
    }

    return {
      v: 3,
      deviceType,
      keyId,
      tracingSeed,
      data,
      publicKey,
      signature,
    };
  }

  const keyId = buffer.getByte();
  const timestamp = buffer.getInt32Le();
  const traceId = bytesToBase64(buffer.getBytes(16));
  const data = bytesToBase64(buffer.getBytes(32));
  const publicKey = bytesToBase64(buffer.getBytes(33));
  const verificationTag = bytesToBase64(buffer.getBytes(8));
  const checksum = bytesToHex(buffer.getBytes(4));

  // checksum check
  const bufferData = bytesToHex(decodedBytes).slice(
    0,
    decodedBytes.length * 2 - 8
  );
  const checksumCheck = SHA256(bufferData).slice(0, 8);

  if (checksumCheck !== checksum) {
    return null;
  }

  return {
    v: 3,
    data,
    keyId,
    traceId,
    publicKey,
    timestamp,
    deviceType,
    verificationTag,
  };
}

// the buffer needs to be advanced by one byte
async function parsePayloadV4(buffer, decodedBytes) {
  const deviceType = buffer.getByte();

  if (deviceType === STATIC_DEVICE_TYPE) {
    const keyId = buffer.getByte();
    const tracingSeed = bytesToBase64(buffer.getBytes(16));
    const data = bytesToBase64(buffer.getBytes(32));
    const publicKey = bytesToBase64(buffer.getBytes(33));
    const signature = bytesToBase64(buffer.getBytes(64));
    const checksum = bytesToHex(buffer.getBytes(4));

    // checksum check
    const bufferData = bytesToHex(decodedBytes).slice(
      0,
      decodedBytes.length * 2 - 8
    );
    const checksumCheck = SHA256(bufferData).slice(0, 8);
    if (checksumCheck !== checksum) {
      return null;
    }

    const L2_INFO = bytesToHex('badge_tracing_assets');
    const l2 = await HKDF_SHA256(base64ToHex(tracingSeed), 48, L2_INFO, '');
    const rawUserId = l2.slice(0, 32);
    const userId = hexToUuid4(rawUserId);

    // signature check
    const isSignatureValid = VERIFY_EC_SHA256_IEEE_SIGNATURE(
      base64ToHex(BADGE_SIGNATURE_PUBLIC_KEY_BASE64_V4),
      userId + base64ToHex(data),
      base64ToHex(signature)
    );

    if (!isSignatureValid) {
      return null;
    }

    return {
      v: 4,
      deviceType,
      keyId,
      tracingSeed,
      data,
      publicKey,
      signature,
    };
  }
  // no mobile v4 yet
  return null;
}

const parseDecodedPayload = async decodedBytes => {
  try {
    const buffer = bytesToBuffer(decodedBytes);

    const v = buffer.getByte();
    if (v === 3) {
      return parsePayloadV3(buffer, decodedBytes);
    }

    if (v === 4) {
      return parsePayloadV4(buffer, decodedBytes);
    }

    return null;
  } catch {
    return null;
  }
};

const parseBase32Encoded = async payload => {
  const decoded = hexToBytes(base32ToHex(payload));
  return parseDecodedPayload(decoded);
};

async function parseZ85Encoded(payload) {
  const decodedBytes = z85ToBytes(payload);
  return parseDecodedPayload(decodedBytes);
}

// try to decode with different layout settings
const strategies = [
  payload => parseBase32Encoded(payload),
  payload => parseBase32Encoded(convertDELayoutToUSLayout(payload)),
  payload => parseZ85Encoded(payload),
  payload => parseZ85Encoded(convertDELayoutToUSLayout(payload)),
];

const parseBase32OrZ85Encoded = async payload => {
  for (const strategy of strategies) {
    try {
      const result = await strategy(payload);
      if (result) return result;
    } catch {
      // eslint-disable-next-line no-continue
      continue;
    }
  }
  return null;
};

export { parseBase32OrZ85Encoded as decode };
