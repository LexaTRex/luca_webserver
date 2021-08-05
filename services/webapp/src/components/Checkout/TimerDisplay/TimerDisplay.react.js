import React from 'react';
import {
  StyledTime,
  StyledTimeType,
  TimeContainer,
} from './TimerDisplay.styled';

export const TimerDisplay = ({ hour, minute, seconds }) => {
  return (
    <TimeContainer>
      <div>
        <StyledTime>{hour}</StyledTime>
        <StyledTimeType>h</StyledTimeType>
      </div>
      <div>
        <StyledTime data-cy="clockMinutes">:{minute}</StyledTime>
        <StyledTimeType isHours>min</StyledTimeType>
      </div>
      <div>
        <StyledTime>:{seconds}</StyledTime>
        <StyledTimeType isHours>s</StyledTimeType>
      </div>
    </TimeContainer>
  );
};
