const chai = require('chai');

const { getApp } = require('../app');

const { expect } = chai;

const INVALID_URL = '/api/notexistant';

describe('Error handler', () => {
  it('should return 404 on an invalid url', async () => {
    const response = await chai.request(getApp()).get(INVALID_URL);

    expect(response.status).to.equal(404);
    expect(response.text).to.equal('Not Found');
  });
});
