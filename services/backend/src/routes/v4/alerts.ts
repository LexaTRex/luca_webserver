import { Router } from 'express';
import moment from 'moment';
import { z } from 'zod';
import status from 'http-status';
import config from 'config';
import database from 'database/models';
import { limitRequestsPerHour } from 'middlewares/rateLimit';
import { requireHealthDepartmentEmployee } from 'middlewares/requireUser';
import { validateSchema } from 'middlewares/validateSchema';
import { sendPlain } from 'utils/mailClient';

import { triggerKeyMismatchSchema } from './alerts.schemas';

const router = Router();

router.post<unknown, unknown, z.infer<typeof triggerKeyMismatchSchema>>(
  '/keymismatch',
  limitRequestsPerHour('keys_alert_ratelimit_hour'),
  requireHealthDepartmentEmployee,
  validateSchema(triggerKeyMismatchSchema),
  async (request, response) => {
    const user = request.user as IHealthDepartmentEmployee;
    const { keyId, expected, received } = request.body;

    const dailyPublicKey = await database.DailyPublicKey.findOne({
      where: {
        keyId,
      },
    });

    const encryptedDailyPrivateKey = await database.EncryptedDailyPrivateKey.findOne(
      {
        where: {
          keyId,
          healthDepartmentId: user.departmentId,
        },
      }
    );

    sendPlain(
      `
      Betroffenes Gesundheitsamt: ${user.departmentId}\n
      Ausstellendes Gesundheitsamt: ${encryptedDailyPrivateKey.issuerId}\n
      Zeitstempel der Überprüfung: ${moment().toLocaleString()}\n
      Zeitstempel der Ausstellung: ${moment(
        dailyPublicKey.createdAt
      ).toLocaleString()}\n
      Überprüfungsergebnis: ${expected}\n
      Erwartetes Überprüfungsergebnis: ${received}
    `,
      `ALERT – ACTION REQUIRED Invalides Schlüsselpaar von ${encryptedDailyPrivateKey.issuerId}`,
      config.get('luca.alerts.receiverEmail')
    );

    response.sendStatus(status.NO_CONTENT);
  }
);

export default router;
