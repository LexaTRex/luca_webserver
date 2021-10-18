export const checkin = traceDataPayload => {
  cy.request('POST', `/api/v3/traces/checkin`, traceDataPayload);
};
