const status = require('http-status');

const requireUserOfType = type => (request, response, next) => {
  if (request.user && request.user.type === type) {
    return next();
  }
  return response.sendStatus(status.UNAUTHORIZED);
};

const requireAdminOfType = type => (request, response, next) => {
  if (
    request.user &&
    request.user.type === type &&
    request.user.isAdmin === true
  ) {
    return next();
  }
  return response.sendStatus(status.UNAUTHORIZED);
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
module.exports = {
  requireOperator: requireUserOfType('Operator'),
  requireHealthDepartmentEmployee: requireUserOfType(
    'HealthDepartmentEmployee'
  ),
  requireHealthDepartmentAdmin: requireAdminOfType('HealthDepartmentEmployee'),
  requireNonDeletedUser,
};
