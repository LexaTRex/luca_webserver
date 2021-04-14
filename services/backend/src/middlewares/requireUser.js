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

module.exports = {
  requireOperator: requireUserOfType('Operator'),
  requireHealthDepartmentEmployee: requireUserOfType(
    'HealthDepartmentEmployee'
  ),
  requireHealthDepartmentAdmin: requireAdminOfType('HealthDepartmentEmployee'),
};
