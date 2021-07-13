const router = require('express').Router();
const { performance } = require('perf_hooks');

const database = require('../../database');

router.post('/clean', async (request, response) => {
  const t0 = performance.now();

  const [workflowOperator, healthDepartmentEmployee] = await Promise.all([
    database.Operator.findOne({
      where: {
        email: 'complete_workflow@nexenio.com',
      },
    }),
    database.HealthDepartmentEmployee.findOne({
      where: {
        email: 'luca@nexenio.com',
      },
    }),
  ]);

  await Promise.all([
    workflowOperator?.update({
      publicKey: null,
      password: 'workflowTesting!',
    }),
    healthDepartmentEmployee?.update({
      password: 'testing',
    }),
    workflowOperator &&
      database.LocationGroup.destroy({
        where: {
          operatorId: workflowOperator.uuid,
        },
      }),
    database.HealthDepartment.update(
      {
        publicHDEKP: null,
        publicHDSKP: null,
      },
      { where: {} }
    ),
    database.TracingProcess.destroy({ where: {} }),
    database.DailyPublicKey.destroy({ where: {} }),
    database.EncryptedDailyPrivateKey.destroy({ where: {} }),
  ]);

  return response.send({ time: performance.now() - t0 });
});
module.exports = router;
