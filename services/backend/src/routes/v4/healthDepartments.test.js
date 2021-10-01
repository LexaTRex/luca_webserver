const express = require('express');
const chai = require('chai');
const chaiHttp = require('chai-http');
const proxyquire = require('proxyquire');

const { expect } = chai;
chai.use(chaiHttp);

const POST_URL = '/healthDepartments/signedKeys';

const voidMiddleware = (request, response, next) => {
  request.user = { departmentId: '9ba590bb-6f0b-4bf1-a035-4fdedfded758' };
  next();
};

const fakeParameters = {
  publicCertificate: 'a'.repeat(8192),
  signedPublicHDEKP: 'a'.repeat(2048),
  signedPublicHDSKP: 'a'.repeat(2048),
};

const voidPromise = () => Promise.resolve(true);

const requireProxies = {
  '../../middlewares/requireUser': {
    requireHealthDepartmentEmployee: voidMiddleware,
    requireHealthDepartmentAdmin: voidMiddleware,
  },
  '../../database': {
    HealthDepartment: {
      findByPk: voidPromise,
    },
  },
  '../../utils/signedKeys': {
    verifySignedPublicKeys() {
      // I do nothing
    },
  },
};

const getResponse = app =>
  chai.request(app).post(POST_URL).send(fakeParameters);

describe('HealthDepartment router', () => {
  describe('POST route', () => {
    it('should reject keys if keys already exist', async () => {
      const app = express();

      app.use(
        '/healthDepartments',
        proxyquire('./healthDepartments', {
          ...requireProxies,
          '../../database': {
            HealthDepartment: {
              findByPk: () =>
                Promise.resolve({
                  signedPublicHDEKP: 'a'.repeat(2048),
                  signedPublicHDSKP: 'a'.repeat(2048),
                }),
            },
          },
        })
      );

      const response = await getResponse(app);
      expect(response.status).to.equal(409);
    });
    it('should reject invalid signatures', async () => {
      const app = express();

      app.use(
        '/healthDepartments',
        proxyquire('./healthDepartments', {
          ...requireProxies,
          '../../utils/signedKeys': {
            verifySignedPublicKeys() {
              throw new Error('invalid signatures');
            },
          },
        })
      );

      const response = await getResponse(app);
      expect(response.status).to.equal(400);
    });
    it('should accept valid keys', async () => {
      const app = express();

      app.use(
        '/healthDepartments',
        proxyquire('./healthDepartments', {
          ...requireProxies,
          '../../database': {
            HealthDepartment: {
              findByPk: () =>
                Promise.resolve({
                  update: voidPromise,
                }),
            },
          },
        })
      );

      const response = await getResponse(app);
      expect(response.status).to.equal(204);
    });
  });
});
