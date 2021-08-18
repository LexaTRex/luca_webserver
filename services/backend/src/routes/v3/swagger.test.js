const chai = require('chai');
const SwaggerParser = require('@apidevtools/swagger-parser');

const { getApp } = require('../../app');

const { expect } = chai;

describe('OpenAPI', () => {
  it('should serve the OpenAPI spec', async () => {
    const response = await chai
      .request(getApp())
      .get('/api/v3/swagger/swagger.json');

    expect(response.status).to.equal(200);
    const spec = JSON.parse(response.text);
    expect(spec.openapi).to.equal('3.0.0');
  });

  it('should generate a valid spec', async () => {
    const response = await chai
      .request(getApp())
      .get('/api/v3/swagger/swagger.json');

    const spec = JSON.parse(response.text);
    const api = await SwaggerParser.validate(spec);

    expect(api).not.equal(undefined);

    expect(api.openapi).to.equal('3.0.0');
  });
});
