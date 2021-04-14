import React from 'react';
import { useIntl } from 'react-intl';

import { WithLocations } from './WithLocations';

import { Wrapper, Title } from './GroupOverview.styled';

export const GroupOverview = ({ group }) => {
  const intl = useIntl();
  return (
    <Wrapper>
      <Title>{intl.formatMessage({ id: 'group.view.overview' })}</Title>
      <WithLocations group={group} />
    </Wrapper>
  );
};
