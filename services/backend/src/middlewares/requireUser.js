const status = require('http-status');
const forge = require('node-forge');
const config = require('config');
const { combineMiddlewares } = require('../utils/middlewares');
const { verifyCertificateAgainstDTrustChain } = require('../utils/signedKeys');

const UserTypes = {
  HD_EMPLOYEE: 'HealthDepartmentEmployee',
  OPERATOR: 'Operator',
};

const isUserOfType = (type, request) =>
  request.user && request.user.type === type;

const hasValidClientCertificate = (user, request) => {
  if (!request.headers['ssl-client-cert']) return false;

  const certificatePem = unescape(request.headers['ssl-client-cert']);
  const certificate = forge.pki.certificateFromPem(certificatePem);
  const commonName = certificate.subject.getField('CN')?.value;
  if (commonName !== user.HealthDepartment.commonName) return false;
  return verifyCertificateAgainstDTrustChain(certificate);
};

const requireOperator = (request, response, next) => {
  if (isUserOfType(UserTypes.OPERATOR, request)) {
    return next();
  }
  return response.sendStatus(status.UNAUTHORIZED);
};

const requireHealthDepartmentEmployee = (request, response, next) => {
  if (
    isUserOfType(UserTypes.HD_EMPLOYEE, request) &&
    (hasValidClientCertificate(request.user, request) || config.get('e2e'))
  ) {
    return next();
  }
  return response.sendStatus(status.UNAUTHORIZED);
};

const requireAdmin = (request, response, next) => {
  if (request.user && request.user.isAdmin === true) {
    return next();
  }
  return response.sendStatus(status.FORBIDDEN);
};

const requireNonDeletedUser = (request, response, next) => {
  if (request.user && !request.user.deletedAt) {
    return next();
  }
  return response.status(status.FORBIDDEN).send({
    message: 'The account has been marked for deletion',
    errorCode: 'ACCOUNT_DEACTIVATED',
  });
};

const requireHealthDepartmentAdmin = combineMiddlewares([
  requireHealthDepartmentEmployee,
  requireAdmin,
]);

module.exports = {
  requireOperator,
  requireHealthDepartmentEmployee,
  requireHealthDepartmentAdmin,
  requireNonDeletedUser,
  isUserOfType,
  UserTypes,
};
