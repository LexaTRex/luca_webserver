import React from 'react';
import { useIntl } from 'react-intl';

import {
  GuestHeader,
  GuestWrapper,
  InfoWrapper,
  Info,
} from '../GroupOverview.styled';

import { Counter } from './WithLocations.styled';

export const WithLocations = ({ group }) => {
  const intl = useIntl();

  return (
    <GuestWrapper>
      <GuestHeader>
        {intl.formatMessage({ id: 'group.view.overview.locations' })}
      </GuestHeader>
      <InfoWrapper>
        <Info>
          <Counter>{group.locations.length}</Counter>
        </Info>
      </InfoWrapper>
    </GuestWrapper>
  );
};
