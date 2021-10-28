export const dynamicCheckin = traceDataPayload => {
  cy.request('POST', '/api/v3/traces/checkin', traceDataPayload);
};

export const formCheckin = ({ formId, traceDataPayload }) => {
  cy.request(
    'POST',
    `/api/v3/forms/${formId}/traces/checkin`,
    traceDataPayload
  );
};
