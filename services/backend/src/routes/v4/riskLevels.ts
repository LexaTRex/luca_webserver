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
  addRiskLevelSchema,
  getRiskLevelParameterSchema,
  addRiskLevelTracesSchema,
} from './riskLevels.schemas';

const RISK_LEVEL_2 = 2;
const RISK_LEVEL_3 = 3;

const router = Router();

router.post(
  '/',
  requireHealthDepartmentEmployee,
  validateSchema(addRiskLevelSchema),
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
        where: { locationTransferId: locationTransfer.uuid },
        include: {
          model: database.RiskLevel,
        },
      }
    );

    const duplicateRiskLevel = locationTransferTraces.some(
      // @ts-ignore - any until models are typed
      locationTransferTrace =>
        locationTransferTrace.RiskLevels.some(
          // @ts-ignore - any until models are typed
          riskLevel => riskLevel.level === RISK_LEVEL_2
        )
    );

    if (duplicateRiskLevel) return response.sendStatus(status.CONFLICT);

    // @ts-ignore - any until models are typed
    const riskLevels = locationTransferTraces.map(locationTransferTrace => ({
      level: RISK_LEVEL_2,
      locationTransferTraceId: locationTransferTrace.uuid,
    }));

    await database.RiskLevel.bulkCreate(riskLevels);

    return response.sendStatus(status.NO_CONTENT);
  }
);

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
        include: {
          model: database.RiskLevel,
        },
      }
    );

    const duplicateRiskLevel = locationTransferTraces.some(
      // @ts-ignore - any until models are typed
      locationTransferTrace =>
        locationTransferTrace.RiskLevels.some(
          // @ts-ignore - any until models are typed
          riskLevel => riskLevel.level === RISK_LEVEL_3
        )
    );

    if (duplicateRiskLevel) return response.sendStatus(status.CONFLICT);

    // @ts-ignore - any until models are typed
    const riskLevels = locationTransferTraces.map(locationTransferTrace => ({
      level: RISK_LEVEL_3,
      locationTransferTraceId: locationTransferTrace.uuid,
    }));

    database.RiskLevel.bulkCreate(riskLevels);

    return response.sendStatus(status.NO_CONTENT);
  }
);

module.exports = router;
