import React from 'react';
import { useIntl } from 'react-intl';
import { ManualInputInfo } from '../Onboarding.styled';

export const ManualAddressText = () => {
  const intl = useIntl();

  return (
    <>
      <ManualInputInfo>
        {intl.formatMessage({
          id: 'addressInput.manualInfo1',
        })}
      </ManualInputInfo>
      <ManualInputInfo isLast highlight>
        {intl.formatMessage({
          id: 'addressInput.manualInfo2',
        })}
      </ManualInputInfo>
    </>
  );
};
