export const regenerateBloomFilter = () => {
    cy.request(
      'POST',
      'https://localhost/api/internal/jobs/regenerateBloomFilter'
    );
  };