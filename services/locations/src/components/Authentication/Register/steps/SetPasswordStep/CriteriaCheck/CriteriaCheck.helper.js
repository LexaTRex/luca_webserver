import { useIntl } from 'react-intl';

export const useCriteria = criteriaCheck => {
  const intl = useIntl();
  return [
    {
      type: 'length',
      intl: intl.formatMessage({
        id: 'authentication.setPassword.criteria.length',
      }),
      ok: criteriaCheck.length,
    },
    {
      type: 'number',
      intl: intl.formatMessage({
        id: 'authentication.setPassword.criteria.number',
      }),
      ok: criteriaCheck.number,
    },
    {
      type: 'upperCase',
      intl: intl.formatMessage({
        id: 'authentication.setPassword.criteria.upperCase',
      }),
      ok: criteriaCheck.upperCase,
    },
    {
      type: 'lowerCase',
      intl: intl.formatMessage({
        id: 'authentication.setPassword.criteria.lowerCase',
      }),
      ok: criteriaCheck.lowerCase,
    },
    {
      type: 'specialChar',
      intl: intl.formatMessage({
        id: 'authentication.setPassword.criteria.specialChar',
      }),
      ok: criteriaCheck.specialChar,
    },
  ];
};
