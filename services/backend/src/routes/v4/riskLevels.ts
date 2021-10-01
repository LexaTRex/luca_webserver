import { Router } from 'express';
import { Op } from 'sequelize';
import status from 'http-status';
import database from 'database/models';
import {
  validateSchema,
  validateParametersSchema,
} from 'middlewares/validateSchema';
import { requireHealthDepartmentEmployee } from 'middlewares/requireUser';
import {
  getRiskLevelParameterSchema,
  addRiskLevelTracesSchema,
} from './riskLevels.schemas';

const router = Router();

router.get(
  '/:locationTransferId',
  requireHealthDepartmentEmployee,
  validateParametersSchema(getRiskLevelParameterSchema),
  async (request, response) => {
    const user = request.user as IHealthDepartmentEmployee;
    const locationTransfer = await database.LocationTransfer.findOne({
      where: {
        uuid: request.params.locationTransferId,
        departmentId: user.departmentId,
      },
    });

    if (!locationTransfer) return response.sendStatus(status.NOT_FOUND);

    const locationTransferTraces = await database.LocationTransferTrace.findAll(
      {
        where: {
          locationTransferId: request.params.locationTransferId,
        },
        include: {
          model: database.RiskLevel,
        },
      }
    );

    const traceIdsWithRiskLevels = locationTransferTraces.map(
      // @ts-ignore - any until models are typed
      locationTransferTrace => {
        const riskLevels = locationTransferTrace.RiskLevels.map(
          // @ts-ignore - any until models are typed
          riskLevel => riskLevel.level
        );
        return { traceId: locationTransferTrace.traceId, riskLevels };
      }
    );
    return response.send(traceIdsWithRiskLevels);
  }
);

router.post(
  '/traces',
  requireHealthDepartmentEmployee,
  validateSchema(addRiskLevelTracesSchema),
  async (request, response) => {
    const user = request.user as IHealthDepartmentEmployee;
    const locationTransfer = await database.LocationTransfer.findOne({
      where: {
        uuid: request.body.locationTransferId,
        departmentId: user.departmentId,
      },
    });

    if (!locationTransfer) return response.sendStatus(status.NOT_FOUND);

    const locationTransferTraces = await database.LocationTransferTrace.findAll(
      {
        where: {
          locationTransferId: locationTransfer.uuid,
          traceId: { [Op.in]: request.body.traceIds },
        },
      }
    );

    // @ts-ignore - any until models are typed
    const riskLevels = locationTransferTraces.map(locationTransferTrace => ({
      level: request.body.riskLevel,
      locationTransferTraceId: locationTransferTrace.uuid,
    }));

    database.RiskLevel.bulkCreate(riskLevels, { ignoreDuplicates: true });

    return response.sendStatus(status.NO_CONTENT);
  }
);

export default router;
