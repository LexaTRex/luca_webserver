import React, { useCallback, useEffect, useState } from 'react';

import moment from 'moment';
import { useIntl } from 'react-intl';
import useInterval from 'use-interval';

import {
  StyledText,
  StyledSection,
  StyledHeadline,
  StyledContainer,
} from './PrivateMeetingInfo.styled';
import { InfoIcon } from '../../InfoIcon/InfoIcon.react';

export function PrivateMeetingInfo({
  startedAt,
  numberOfGuests,
  numberOfActiveGuests,
  onPeopleInfoClick = () => {},
}) {
  const { formatMessage } = useIntl();
  const [clockTime, setClockTime] = useState('00:00:00');

  const privateMeetingClock = useCallback(() => {
    if (startedAt) {
      const time = moment.duration(moment().diff(moment.unix(startedAt)));
      const formattedHours = time.hours().toString().padStart(2, '0');
      const formattedMinutes = time.minutes().toString().padStart(2, '0');
      const formattedSeconds = time.seconds().toString().padStart(2, '0');
      const formattedClockTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
      setClockTime(formattedClockTime);
    }
  }, [startedAt]);

  useEffect(() => {
    privateMeetingClock();
  }, [privateMeetingClock]);
  useInterval(privateMeetingClock, 1000);

  return (
    <StyledContainer>
      <StyledSection>
        <StyledHeadline>
          {formatMessage({ id: 'PrivateMeeting.Time' })}
        </StyledHeadline>
        <StyledText styles={{ paddingTop: 1 }}>{clockTime}</StyledText>
      </StyledSection>
      <StyledSection>
        <StyledHeadline>
          {formatMessage({ id: 'PrivateMeeting.NumberOfPeople' })}
          <InfoIcon onClick={onPeopleInfoClick} />
        </StyledHeadline>
        <StyledText>
          {numberOfActiveGuests}/{numberOfGuests}
        </StyledText>
      </StyledSection>
    </StyledContainer>
  );
}
