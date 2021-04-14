const { performance } = require('perf_hooks');
const config = require('config');
const router = require('express').Router();
const moment = require('moment');
const { Op, fn, col } = require('sequelize');

const database = require('../../database');

router.post('/deleteOldTraces', async (request, response) => {
  const t0 = performance.now();
  const affectedRows = await database.Trace.destroy({
    where: {
      time: {
        [Op.strictLeft]: [
          moment().subtract(config.get('luca.traces.maxAge'), 'hours'),
          null,
        ],
      },
    },
  });
  response.send({ affectedRows, time: performance.now() - t0 });
});

router.post('/checkoutOldTraces', async (request, response) => {
  const t0 = performance.now();
  const [affectedRows] = await database.Trace.update(
    {
      time: fn('tstzrange', fn('lower', col('time')), moment().toISOString()),
    },
    {
      where: {
        time: {
          [Op.contains]: [
            moment().subtract(config.get('luca.traces.maxDuration'), 'hours'),
            moment(),
          ],
        },
      },
    }
  );
  response.send({ affectedRows, time: performance.now() - t0 });
});

router.post('/deleteOldInactiveOperators', async (request, response) => {
  const t0 = performance.now();
  const affectedRows = await database.Operator.destroy({
    where: {
      createdAt: {
        [Op.lt]: moment().subtract(config.get('emails.expiry'), 'hours'),
      },
      activated: false,
    },
    force: true,
  });

  response.send({ affectedRows, time: performance.now() - t0 });
});

router.post('/deleteUnusedUserTransfers', async (request, response) => {
  const t0 = performance.now();
  const affectedRows = await database.UserTransfer.destroy({
    where: {
      createdAt: {
        [Op.lt]: moment().subtract(
          config.get('luca.userTransfers.maxAge'),
          'hours'
        ),
      },
      departmentId: null,
    },
  });
  response.send({ affectedRows, time: performance.now() - t0 });
});

router.post(
  '/deleteOldLocationTransferTraceData',
  async (request, response) => {
    const t0 = performance.now();

    const earliestCreationTimeToKeep = moment().subtract(
      config.get('luca.locationTransferTraces.maxAge'),
      'hours'
    );

    const eraseFields = {
      data: null,
      additionalData: null,
      additionalDataPublicKey: null,
      additionalDataMAC: null,
      additionalDataIV: null,
    };
    const [affectedRows] = await database.LocationTransferTrace.update(
      eraseFields,
      {
        where: {
          createdAt: {
            [Op.lt]: earliestCreationTimeToKeep,
          },
        },
      }
    );

    response.send({
      affectedRows,
      time: performance.now() - t0,
    });
  }
);

router.post('/cleanUpLocations', async (request, response) => {
  const t0 = performance.now();
  const maxAge = config.get('luca.locations.maxAge');
  const affectedGroupRows = await database.LocationGroup.destroy({
    where: {
      deletedAt: {
        [Op.lt]: moment().subtract(maxAge, 'hours'),
      },
    },
    force: true,
  });
  const affectedLocationRows = await database.Location.destroy({
    where: {
      deletedAt: {
        [Op.lt]: moment().subtract(maxAge, 'hours'),
      },
    },
    force: true,
  });

  response.send({
    time: performance.now() - t0,
    affectedRows: affectedGroupRows + affectedLocationRows,
  });
});

router.post('/cleanUpChallenges', async (request, response) => {
  const t0 = performance.now();
  const affectedRows = await database.SMSChallenge.update(
    { messageId: '' },
    {
      where: {
        createdAt: {
          [Op.lt]: moment().subtract(
            config.get('luca.smsChallenges.maxAge'),
            'hours'
          ),
        },
      },
    }
  );

  response.send({
    affectedRows,
    time: performance.now() - t0,
  });
});

module.exports = router;
