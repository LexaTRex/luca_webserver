import React, { useEffect, useRef } from 'react';
import {
  FormItem,
  StyledLabel,
  StyledInput,
  StyledContainer,
} from './TextInput.styled';

export function TextInput({
  name,
  rules,
  placeholder,
  defaultValue,
  validateTrigger,
  bgColor = '#000',
  ...otherProperties
}) {
  const inputReference = useRef();

  useEffect(() => {
    if (defaultValue && inputReference?.current) {
      inputReference.current.dispatchEvent(
        new Event('input', { bubbles: true })
      );
    }
  }, [defaultValue]);

  return (
    <FormItem
      style={{ color: '#fff' }}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      validateTrigger={validateTrigger}
    >
      <StyledContainer>
        <StyledInput
          type="text"
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...otherProperties}
          ref={inputReference}
        />
        <StyledLabel
          bgColor={bgColor}
          onClick={() =>
            inputReference &&
            inputReference.current &&
            inputReference.current.focus()
          }
        >
          {placeholder}
        </StyledLabel>
      </StyledContainer>
    </FormItem>
  );
}
