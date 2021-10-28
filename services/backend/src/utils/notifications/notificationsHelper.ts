import Sequelize, { Op } from 'sequelize';
import { LocationTransfer, LocationTransferTrace, RiskLevel } from 'database';
import featureFlag from 'utils/featureFlag';
import { RiskLevel as RiskLevels } from 'constants/riskLevels';
import { DEVICE_TYPE_IOS, DEVICE_TYPE_ANDROID } from 'constants/deviceTypes';
import { LocationTransferInstance } from 'database/models/locationTransfer';

export const checkForAndAddLevel4RiskLevels = async (
  transfer: LocationTransferInstance,
  transaction: Sequelize.Transaction
) => {
  const level4NotificationsEnabled = await featureFlag.get(
    'enable_level_4_notifications'
  );
  if (!level4NotificationsEnabled) return;

  const existingLocationTransfers = await LocationTransfer.findAll({
    where: {
      locationId: transfer.locationId,
      departmentId: { [Op.not]: transfer.departmentId },
      contactedAt: { [Op.not]: null },
      time: { [Op.overlap]: transfer.time as [Date, Date] },
    },
    include: {
      model: LocationTransferTrace,
      where: { deviceType: [DEVICE_TYPE_IOS, DEVICE_TYPE_ANDROID] },
    },
  });

  // Avoid adding risk levels to own health department when no overlapping are found
  if (existingLocationTransfers.length > 0) {
    const ownTransferWithTraces = await LocationTransfer.findOne({
      where: {
        uuid: transfer.uuid,
        departmentId: transfer.departmentId,
      },
      include: {
        model: LocationTransferTrace,
        where: { deviceType: [DEVICE_TYPE_IOS, DEVICE_TYPE_ANDROID] },
      },
    });
    existingLocationTransfers.push(ownTransferWithTraces!);
  }

  const level4RiskLevels = existingLocationTransfers.flatMap(
    existingLocationTransfer =>
      existingLocationTransfer.LocationTransferTraces!.map(
        locationTransferTrace => ({
          locationTransferTraceId: locationTransferTrace.uuid,
          level: RiskLevels.RISK_LEVEL_4,
        })
      )
  );

  await RiskLevel.bulkCreate(
    level4RiskLevels,
    {
      ignoreDuplicates: true,
    },
    // @ts-ignore according to sequelize there are too many arguments
    transaction
  );
};
