export function sortTraces(traces) {
  return traces.sort((traceA, traceB) => {
    if (!traceA.checkout) {
      return -1;
    }

    if (!traceB.checkout) {
      return 1;
    }

    return traceB.checkout - traceA.checkout;
  });
}
