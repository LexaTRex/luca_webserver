import React from 'react';
import { StyledContainer, StyledInfoText } from './InfoIcon.styled';

export function InfoIcon({ inverted, ...otherProperties }) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <StyledContainer inverted={inverted} {...otherProperties}>
      <StyledInfoText inverted={inverted}>i</StyledInfoText>
    </StyledContainer>
  );
}
