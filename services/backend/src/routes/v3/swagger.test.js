const chai = require('chai');

const { getApp } = require('../../app');

const { expect } = chai;

describe('OpenAPI', () => {
  it('should serve the OpenAPI spec', async () => {
    const response = await chai
      .request(getApp())
      .get('/v3/swagger/swagger.json');

    expect(response.status).to.equal(200);
    const spec = JSON.parse(response.text);
    expect(spec.openapi).to.equal('3.0.0');
  });
});
