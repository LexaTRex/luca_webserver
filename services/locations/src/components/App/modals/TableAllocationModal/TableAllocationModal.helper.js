import {
  base64ToHex,
  decodeUtf8,
  DECRYPT_DLIES,
  hexToBytes,
} from '@lucaapp/crypto';

export function extractTableNumbers(traces, privateKey) {
  const activeTraces = (traces || []).filter(trace => !trace.checkout);
  const tables = {};
  for (const trace of activeTraces) {
    try {
      const { data, iv, mac, publicKey } = trace.data;
      const decryptedAdditionalData = decodeUtf8(
        hexToBytes(
          DECRYPT_DLIES(
            privateKey,
            base64ToHex(publicKey),
            base64ToHex(data),
            base64ToHex(iv),
            base64ToHex(mac)
          )
        )
      );
      const { table } = JSON.parse(decryptedAdditionalData);
      if (typeof table === 'number') {
        if (!tables[table]) {
          tables[table] = 1;
        } else {
          tables[table] += 1;
        }
      }
      // eslint-disable-next-line no-empty
    } catch {}
  }

  return tables;
}
