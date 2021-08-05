import React from 'react';
import { useIntl } from 'react-intl';

import { RequestContent } from '../../ShareData.styled';
import { StyledLabel, StyledValue } from '../ShareDataStep.styled';

export const Checkins = ({ transfers }) => {
  const intl = useIntl();

  return (
    <RequestContent>
      <StyledLabel>
        {intl.formatMessage({ id: 'shareData.activeCheckIns' })}
      </StyledLabel>
      <StyledValue>
        {transfers.reduce((sum, transfer) => sum + transfer.traces.length, 0)}
      </StyledValue>
    </RequestContent>
  );
};
