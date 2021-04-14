const { int32ToHex, GENERATE_TRACE_ID } = require('@lucaapp/crypto');

const calculateTraceIds = (userId, userTracingSecret, start, days) => {
  const traceIds = [];
  const minutesToCalculate = days * 24 * 60;
  for (let minute = 0; minute < minutesToCalculate; minute += 1) {
    const traceId = GENERATE_TRACE_ID(
      userId + int32ToHex(start + 60 * minute),
      userTracingSecret
    );
    traceIds.push(traceId);
  }
  return traceIds;
};

module.exports = {
  calculateTraceIds,
};
