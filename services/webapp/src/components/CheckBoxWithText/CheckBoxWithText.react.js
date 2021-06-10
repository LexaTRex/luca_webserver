import React from 'react';
import {
  StyledText,
  StyledCheckbox,
  StyledContainer,
} from './CheckBoxWithText.styled';

export function CheckBoxWithText({
  value,
  testId,
  tabIndex,
  onChange,
  description,
  color = '#fff',
}) {
  return (
    <StyledContainer>
      <StyledCheckbox
        value={value}
        data-cy={testId}
        onChange={onChange}
        tabIndex={tabIndex}
      >
        <StyledText style={{ color }}>{description}</StyledText>
      </StyledCheckbox>
    </StyledContainer>
  );
}
