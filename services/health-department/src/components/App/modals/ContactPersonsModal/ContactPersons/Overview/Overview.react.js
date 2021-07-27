import React from 'react';
import { useIntl } from 'react-intl';

import { formattedTimeLabel } from 'utils/time';

import { Wrapper, OverviewItem, Name, Value } from './Overview.styled';

export const Overview = ({ location }) => {
  const intl = useIntl();

  return (
    <Wrapper>
      <OverviewItem>
        <Name>
          {intl.formatMessage({ id: 'history.label.locationCategory' })}
        </Name>
        <Value>
          {intl.formatMessage({
            id: `history.location.category.${location.type}`,
          })}
        </Value>
      </OverviewItem>
      <OverviewItem>
        <Name>{intl.formatMessage({ id: 'history.label.contactInfo' })}</Name>
        <Value>{`${location.firstName} ${location.lastName}`}</Value>
        <Value>{location.phone}</Value>
      </OverviewItem>
      <OverviewItem>
        <Name>{intl.formatMessage({ id: 'history.label.duration' })}</Name>
        <Value>{formattedTimeLabel(location.time[0])}</Value>
        <Value>{formattedTimeLabel(location.time[1])}</Value>
      </OverviewItem>
      <OverviewItem>
        <Name>{intl.formatMessage({ id: 'history.label.areaDetails' })}</Name>
        <Value>
          {location.isIndoor
            ? intl.formatMessage({ id: 'history.label.indoor' })
            : intl.formatMessage({ id: 'history.label.outdoor' })}
        </Value>
      </OverviewItem>
    </Wrapper>
  );
};
