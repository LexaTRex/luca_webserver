/* eslint-disable max-lines */
const { performance } = require('perf_hooks');
const config = require('config');
const router = require('express').Router();
const moment = require('moment');
const crypto = require('crypto');
const { Op, fn, col } = require('sequelize');
const status = require('http-status');

const { GET_RANDOM_BYTES, hexToBase64 } = require('@lucaapp/crypto');

const database = require('../../database');
const featureFlag = require('../../utils/featureFlag');
const {
  generateNotifications,
} = require('../../utils/notifications/notificationsV3');
const {
  generateActiveChunk,
  generateArchiveChunk,
} = require('../../utils/notifications/notificationsV4');
const { updateBloomFilter } = require('../../utils/bloomFilter');

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

router.post('/deleteOldTracingProcesses', async (_, response) => {
  const t0 = performance.now();

  const affectedRows = await database.TracingProcess.destroy({
    where: {
      createdAt: {
        [Op.lt]: moment().subtract(
          config.get('luca.tracingProcess.maxAge'),
          'hours'
        ),
      },
    },
    paranoid: false,
    force: true,
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

router.post('/removeDeletedOperators', async (request, response) => {
  const t0 = performance.now();
  const earliestTimeToKeep = moment().subtract(
    config.get('luca.operators.deleted.maxAgeHours'),
    'hours'
  );
  const affectedRows = await database.Operator.destroy({
    where: {
      deletedAt: {
        [Op.lt]: earliestTimeToKeep,
      },
    },
    paranoid: false,
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

router.post('/cleanUpUsers', async (request, response) => {
  const t0 = performance.now();
  const maxAge = config.get('luca.users.maxAge');
  const affectedRows = await database.User.destroy({
    where: {
      deletedAt: {
        [Op.lt]: moment().subtract(maxAge, 'hours'),
      },
    },
    force: true,
  });

  response.send({
    affectedRows,
    time: performance.now() - t0,
  });
});

router.post('/addDummyTraces', async (request, response) => {
  const t0 = performance.now();
  const healthDepartments = await database.HealthDepartment.findAll({
    where: {
      publicHDSKP: {
        [Op.not]: null,
      },
    },
  });
  const healthDepartment =
    healthDepartments[crypto.randomInt(0, healthDepartments.length)];

  for (
    let tracingIndex = 0;
    tracingIndex <
    crypto.randomInt(0, await featureFlag.get('dummy_max_tracings'));
    tracingIndex += 1
  ) {
    const traces = [];
    const baseTime = moment().subtract(
      crypto.randomInt(0, moment.duration(10, 'days').asSeconds()),
      's'
    );

    for (
      let traceIndex = 0;
      traceIndex <
      crypto.randomInt(0, await featureFlag.get('dummy_max_traces'));
      traceIndex += 1
    ) {
      traces.push({
        healthDepartmentId: healthDepartment.uuid,
        traceId: hexToBase64(GET_RANDOM_BYTES(16)),
        createdAt: moment(baseTime).subtract(
          crypto.randomInt(0, 720) - 360,
          'minutes'
        ),
      });
    }
    await database.DummyTrace.bulkCreate(traces);
  }

  response.send({
    time: performance.now() - t0,
  });
});

router.post('/deleteOldTestRedeems', async (request, response) => {
  const t0 = performance.now();
  const maxAge = config.get('luca.testRedeems.maxAge');
  const affectedRows = await database.TestRedeem.destroy({
    where: {
      createdAt: {
        [Op.lt]: moment().subtract(maxAge, 'hours'),
      },
    },
  });
  response.send({ affectedRows, time: performance.now() - t0 });
});

router.post('/regenerateNotifications', async (request, response) => {
  const t0 = performance.now();
  await generateNotifications();

  response.send({
    time: performance.now() - t0,
  });
});

router.post(
  '/regenerateV4NotificationsActiveChunk',
  async (request, response) => {
    const t0 = performance.now();
    await generateActiveChunk();

    response.send({
      time: performance.now() - t0,
    });
  }
);

router.post(
  '/generateV4NotificationsArchiveChunk',
  async (request, response) => {
    const t0 = performance.now();
    await generateArchiveChunk();

    response.send({
      time: performance.now() - t0,
    });
  }
);

router.post('/deleteOldV4NotificationChunks', async (request, response) => {
  const t0 = performance.now();
  const earliestTimeToKeep = moment().subtract(
    config.get('luca.notificationChunks.maxAge'),
    'hours'
  );
  const affectedRows = await database.NotificationChunk.destroy({
    where: {
      createdAt: {
        [Op.lt]: earliestTimeToKeep,
      },
    },
    paranoid: false,
    force: true,
  });

  response.send({ affectedRows, time: performance.now() - t0 });
});

router.post('/regenerateBloomFilter', async (request, response) => {
  updateBloomFilter();
  response.sendStatus(status.NO_CONTENT);
});

router.post('/deleteOldAuditLogs', async (request, response) => {
  const t0 = performance.now();
  const maxAge = config.get('luca.auditLogs.maxAge');
  const affectedRows = await database.HealthDepartmentAuditLog.destroy({
    where: {
      createdAt: {
        [Op.lt]: moment().subtract(maxAge, 'hours'),
      },
    },
  });

  response.send({
    affectedRows,
    time: performance.now() - t0,
  });
});

module.exports = router;
