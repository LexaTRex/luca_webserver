const router = require('express').Router();
const status = require('http-status');
const { performance } = require('perf_hooks');
const { validateSchema } = require('../../middlewares/validateSchema');
const database = require('../../database');

const { storeKeysSchema } = require('./en2end.schema');

router.post(
  '/signHealthDepartment',
  validateSchema(storeKeysSchema),
  async (request, response) => {
    const healthDepartment = await database.HealthDepartment.findOne({
      where: {
        name: 'neXenio Testing',
      },
    });

    await healthDepartment.update({
      publicCertificate: request.body.publicCertificate,
      signedPublicHDEKP: request.body.signedPublicHDEKP,
      signedPublicHDSKP: request.body.signedPublicHDSKP,
    });

    response.sendStatus(status.NO_CONTENT);
  }
);

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
        publicCertificate: null,
        signedPublicHDEKP: null,
        signedPublicHDSKP: null,
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
