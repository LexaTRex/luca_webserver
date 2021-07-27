import React from 'react';
import { useIntl } from 'react-intl';

import { LICENSES_ROUTE } from 'constants/routes';

import { LicenseWrapper, Link } from './LicenseLink.styled';

export const LicenseLink = () => {
  const intl = useIntl();

  return (
    <LicenseWrapper>
      <Link target="_blank" rel="noopener noreferrer" href={LICENSES_ROUTE}>
        {intl.formatMessage({
          id: 'license.license',
        })}
      </Link>
    </LicenseWrapper>
  );
};
