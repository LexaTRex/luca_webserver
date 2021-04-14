import React from 'react';
import { StyledContainer, StyledInfoText } from './InfoIcon.styled';

export function InfoIcon({ inverted, onClick }) {
  return (
    <StyledContainer inverted={inverted} onClick={onClick}>
      <StyledInfoText inverted={inverted}>i</StyledInfoText>
    </StyledContainer>
  );
}
