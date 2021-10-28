export const regenerateBloomFilter = () => {
  cy.request({
    method: 'POST',
    url: 'https://localhost/api/internal/jobs/regenerateBloomFilter',
    headers: {
      'internal-access-authorization': 'bHVjYTpBOTNrcE01em1DdHZ2dEhO',
    },
  });
};
