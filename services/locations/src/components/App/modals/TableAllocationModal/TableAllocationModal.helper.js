import { decryptAdditionalData } from 'utils/crypto';

export function extractTableNumbers(traces, privateKey) {
  const tables = {};
  const activeTraces = (traces || []).filter(trace => !trace.checkout);
  for (const trace of activeTraces) {
    try {
      const { table } = decryptAdditionalData(trace.data, privateKey);
      if (typeof table === 'number') {
        if (tables[table]) {
          tables[table].push(trace.traceId);
        } else {
          tables[table] = [trace.traceId];
        }
      }
      // eslint-disable-next-line no-empty
    } catch {}
  }

  return tables;
}
