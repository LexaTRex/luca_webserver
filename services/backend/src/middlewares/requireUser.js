const status = require('http-status');
const forge = require('node-forge');
const config = require('config');
const { UserType } = require('../constants/user');
const { combineMiddlewares } = require('../utils/middlewares');
const { verifyCertificateAgainstDTrustChain } = require('../utils/signedKeys');

const isUserOfType = (type, request) =>
  request.user && request.user.type === type;

const isUserOfRoleType = (role, request) =>
  request.user && request.user.device && request.user.device.role === role;

const hasValidClientCertificate = (user, request) => {
  if (!request.headers['ssl-client-cert']) return false;

  const certificatePem = unescape(request.headers['ssl-client-cert']);
  const certificate = forge.pki.certificateFromPem(certificatePem);
  const commonName = certificate.subject.getField('CN')?.value;
  if (commonName !== user.HealthDepartment.commonName) return false;
  return verifyCertificateAgainstDTrustChain(certificate);
};

const requireOperator = (request, response, next) => {
  if (isUserOfType(UserType.OPERATOR, request)) {
    return next();
  }
  return response.sendStatus(status.UNAUTHORIZED);
};

const requireOperatorDevice = (request, response, next) => {
  if (isUserOfType(UserType.OPERATOR_DEVICE, request)) {
    return next();
  }
  return response.sendStatus(status.UNAUTHORIZED);
};

const requireOperatorDeviceRole = role => (request, response, next) => {
  if (isUserOfType(UserType.OPERATOR, request)) {
    return next();
  }

  if (isUserOfRoleType(role, request)) {
    return next();
  }

  return response.sendStatus(status.FORBIDDEN);
};
const requireOperatorDeviceRoles = roles => {
  const rolesMap = {};

  for (const role of roles) {
    // eslint-disable-next-line security/detect-object-injection
    rolesMap[role] = true;
  }

  return (request, response, next) => {
    if (isUserOfType(UserType.OPERATOR, request)) {
      return next();
    }

    if (
      request.user &&
      request.user.device &&
      rolesMap[request.user.device.role]
    ) {
      return next();
    }

    return response.sendStatus(status.FORBIDDEN);
  };
};

const requireOperatorOROperatorDevice = (request, response, next) => {
  if (
    isUserOfType(UserType.OPERATOR, request) ||
    isUserOfType(UserType.OPERATOR_DEVICE, request)
  ) {
    return next();
  }
  return response.sendStatus(status.UNAUTHORIZED);
};

const requireHealthDepartmentEmployee = (request, response, next) => {
  if (
    isUserOfType(UserType.HEALTH_DEPARTMENT_EMPLOYEE, request) &&
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
  requireOperatorDevice,
  requireOperatorDeviceRole,
  requireOperatorDeviceRoles,
  requireOperatorOROperatorDevice,
  requireHealthDepartmentEmployee,
  requireHealthDepartmentAdmin,
  requireNonDeletedUser,
  isUserOfType,
};
