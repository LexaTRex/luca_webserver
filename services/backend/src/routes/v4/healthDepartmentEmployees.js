const router = require('express').Router();

const {
  requireHealthDepartmentEmployee,
} = require('../../middlewares/requireUser');

router.get('/me', requireHealthDepartmentEmployee, (request, response) => {
  return response.send({
    uuid: request.user.uuid,
    username: request.user.username,
    firstName: request.user.firstName,
    lastName: request.user.lastName,
    email: request.user.email,
    departmentId: request.user.departmentId,
    isAdmin: request.user.isAdmin,
  });
});

module.exports = router;
