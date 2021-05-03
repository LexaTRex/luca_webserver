import React from 'react';
import {
  StyledContent,
  StyledCheckbox,
  StyledContainer,
  StyledText,
} from './CheckBoxWithText.styled';

export function CheckBoxWithText({ value, onChange, description, testId }) {
  return (
    <StyledContainer>
      <StyledCheckbox value={value} onChange={onChange} data-cy={testId} />
      <StyledContent>
        <StyledText>{description}</StyledText>
      </StyledContent>
    </StyledContainer>
  );
}
