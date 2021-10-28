import config from 'config';
import { RetentionPolicy, ZipCodeMapping } from 'database';

const DEFAULT_RETENTION_PERIOD = config.get<number>('luca.traces.maxAge');

export const getRetentionPeriodForZipCode = async (
  zipCode?: string
): Promise<number> => {
  if (!zipCode) return DEFAULT_RETENTION_PERIOD;
  const retentionPolicies = await RetentionPolicy.findAll({
    attributes: ['retentionPeriod'],
    include: {
      required: true,
      model: ZipCodeMapping,
      attributes: [],
      where: {
        zipCode,
      },
    },
  });

  const retentionPeriod = Math.max(
    0,
    ...retentionPolicies.map(policy => policy.retentionPeriod)
  );
  return retentionPeriod || DEFAULT_RETENTION_PERIOD;
};
