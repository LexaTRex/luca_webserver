import React from 'react';
import { useIntl } from 'react-intl';

import { LocationCard } from '../LocationCard';

import { Info } from './Info';
import { Wrapper } from './ScannerSelection.styled';
import { CheckinOptions } from './CheckinOptions';

export const ScannerSelection = ({ location }) => {
  const intl = useIntl();

  return (
    <LocationCard
      title={intl.formatMessage({ id: 'group.view.checkinGuests' })}
    >
      <Wrapper>
        <Info />
        <CheckinOptions location={location} />
      </Wrapper>
    </LocationCard>
  );
};
