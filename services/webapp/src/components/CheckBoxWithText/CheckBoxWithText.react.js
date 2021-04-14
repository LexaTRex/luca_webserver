import React from 'react';
import {
  StyledContent,
  StyledCheckbox,
  StyledContainer,
  StyledText,
} from './CheckBoxWithText.styled';

export function CheckBoxWithText({ value, onChange, description }) {
  return (
    <StyledContainer>
      <StyledCheckbox value={value} onChange={onChange} />
      <StyledContent>
        <StyledText>{description}</StyledText>
      </StyledContent>
    </StyledContainer>
  );
}
