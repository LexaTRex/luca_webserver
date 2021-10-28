import { Router } from 'express';
import { Op } from 'sequelize';
import status from 'http-status';
import { LocationTransfer, LocationTransferTrace, RiskLevel } from 'database';
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
    const locationTransfer = await LocationTransfer.findOne({
      where: {
        uuid: request.params.locationTransferId,
        departmentId: user.departmentId,
      },
    });

    if (!locationTransfer) return response.sendStatus(status.NOT_FOUND);

    const locationTransferTraces = await LocationTransferTrace.findAll({
      where: {
        locationTransferId: request.params.locationTransferId,
      },
      include: {
        model: RiskLevel,
      },
    });

    const traceIdsWithRiskLevels = locationTransferTraces.map(
      locationTransferTrace => {
        const riskLevels = locationTransferTrace.RiskLevels!.map(
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
    const locationTransfer = await LocationTransfer.findOne({
      where: {
        uuid: request.body.locationTransferId,
        departmentId: user.departmentId,
      },
    });

    if (!locationTransfer) return response.sendStatus(status.NOT_FOUND);

    const locationTransferTraces = await LocationTransferTrace.findAll({
      where: {
        locationTransferId: locationTransfer.uuid,
        traceId: { [Op.in]: request.body.traceIds },
      },
    });

    const riskLevels = locationTransferTraces.map(locationTransferTrace => ({
      level: request.body.riskLevel,
      locationTransferTraceId: locationTransferTrace.uuid,
    }));

    RiskLevel.bulkCreate(riskLevels, { ignoreDuplicates: true });

    return response.sendStatus(status.NO_CONTENT);
  }
);

export default router;
