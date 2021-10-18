import Sequelize, { Op } from 'sequelize';
import database from 'database';
import featureFlag from 'utils/featureFlag';
import { RiskLevel } from 'constants/riskLevels';
import { DEVICE_TYPE_IOS, DEVICE_TYPE_ANDROID } from 'constants/deviceTypes';

export const checkForAndAddLevel4RiskLevels = async (
  // @ts-ignore - any until models are typed
  transfer,
  transaction: Sequelize.Transaction
) => {
  const level4NotificationsEnabled = await featureFlag.get(
    'enable_level_4_notifications'
  );
  if (!level4NotificationsEnabled) return;

  const existingLocationTransfers = await database.LocationTransfer.findAll({
    where: {
      locationId: transfer.locationId,
      departmentId: { [Op.not]: transfer.departmentId },
      contactedAt: { [Op.not]: null },
      time: { [Op.overlap]: transfer.time },
    },
    include: {
      model: database.LocationTransferTrace,
      where: { deviceType: [DEVICE_TYPE_IOS, DEVICE_TYPE_ANDROID] },
    },
  });

  // Avoid adding risk levels to own health department when no overlapping are found
  if (existingLocationTransfers.length > 0) {
    const ownTransferWithTraces = await database.LocationTransfer.findOne({
      where: {
        uuid: transfer.uuid,
        departmentId: transfer.departmentId,
      },
      include: {
        model: database.LocationTransferTrace,
        where: { deviceType: [DEVICE_TYPE_IOS, DEVICE_TYPE_ANDROID] },
      },
    });
    existingLocationTransfers.push(ownTransferWithTraces);
  }

  const level4RiskLevels = existingLocationTransfers.flatMap(
    // @ts-ignore - any until models are typed
    existingLocationTransfer =>
      existingLocationTransfer.LocationTransferTraces.map(
        // @ts-ignore - any until models are typed
        locationTransferTrace => ({
          locationTransferTraceId: locationTransferTrace.uuid,
          level: RiskLevel.RISK_LEVEL_4,
        })
      )
  );

  await database.RiskLevel.bulkCreate(
    level4RiskLevels,
    {
      ignoreDuplicates: true,
    },
    transaction
  );
};
