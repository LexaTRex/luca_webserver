const MINUTE_SECONDS = 60;

export const filterForTimeOverlap = (
  decryptedTraces,
  minTimeOverlap,
  indexPersonData
) => {
  const minTimeOverlapSeconds = minTimeOverlap * MINUTE_SECONDS;
  if (minTimeOverlap < 0) return decryptedTraces;
  if (!indexPersonData) return decryptedTraces;
  const indexCaseTrace = decryptedTraces.find(
    trace => trace.userData?.pn === indexPersonData.pn
  );
  if (!indexCaseTrace || !indexCaseTrace.checkout) return decryptedTraces;
  const filteredDecryptedTraces = [{ ...indexCaseTrace, isIndexCase: true }];
  decryptedTraces.forEach(compareTrace => {
    if (indexCaseTrace.traceId === compareTrace.traceId) return;
    if (!compareTrace.checkout) {
      filteredDecryptedTraces.push(compareTrace);
      return;
    }
    const overlapStart = Math.max(indexCaseTrace.checkin, compareTrace.checkin);
    const overlapEnd = Math.min(indexCaseTrace.checkout, compareTrace.checkout);

    const overlapTime = overlapEnd - overlapStart;
    if (overlapTime >= minTimeOverlapSeconds) {
      filteredDecryptedTraces.push(compareTrace);
    }
  });

  return filteredDecryptedTraces;
};
