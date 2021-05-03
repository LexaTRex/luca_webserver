import React from 'react';
import { useIntl } from 'react-intl';

import { INITIAL_OVERLAP_VALUE } from 'constants/timeOverlap';

import {
  OverlapSelectorWrapper,
  StyledInputNumber,
} from './OverlapTimeSelector.styled';

export const OverlapTimeSelector = ({ setMinTimeOverlap }) => {
  const intl = useIntl();

  return (
    <OverlapSelectorWrapper>
      {intl.formatMessage({ id: 'contactPersonTable.timeOverlap' })}
      <StyledInputNumber
        defaultValue={INITIAL_OVERLAP_VALUE}
        min={0}
        formatter={value => {
          if (value === '0') {
            return intl.formatMessage({
              id: 'contactPersonTable.showAll',
            });
          }
          return `${value} ${intl.formatMessage({
            id: 'contactPersonTable.minutes',
          })}`;
        }}
        parser={value => {
          if (
            value ===
            intl.formatMessage({
              id: 'contactPersonTable.showAll',
            })
          ) {
            return 0;
          }
          return value.replace(/[^0-9]/g, '');
        }}
        onChange={setMinTimeOverlap}
        autoFocus
      />
    </OverlapSelectorWrapper>
  );
};
