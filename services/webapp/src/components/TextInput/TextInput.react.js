import React, { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';

import {
  FormItem,
  StyledLabel,
  StyledInput,
  StyledContainer,
} from './TextInput.styled';

export function TextInput({
  id,
  name,
  rules,
  label,
  placeholder,
  defaultValue,
  validateTrigger,
  bgColor = '#000',
  isRequired = false,
  ...otherProperties
}) {
  const intl = useIntl();
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
          id={name}
          type="text"
          name={name}
          required={isRequired}
          placeholder={placeholder}
          defaultValue={defaultValue}
          aria-label={`${intl.formatMessage(
            { id: 'Form.Input.AriaLabel' },
            { fieldName: label }
          )} ${intl.formatMessage({ id: 'Form.Validation.isRequired' })}`}
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...otherProperties}
          ref={inputReference}
        />
        <StyledLabel
          htmlFor={id}
          bgColor={bgColor}
          onClick={() =>
            inputReference &&
            inputReference.current &&
            inputReference.current.focus()
          }
        >
          {label}
        </StyledLabel>
      </StyledContainer>
    </FormItem>
  );
}
