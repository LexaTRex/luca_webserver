import 'react-phone-input-2/lib/material.css';

import React, { useState } from 'react';
import PhoneInputComponent from 'react-phone-input-2';
import { FormItem, StyledContainer } from './PhoneInput.styled';

export function PhoneInput({
  name,
  rules,
  placeholder,
  defaultValue,
  validateTrigger,
  onDialCodeChange,
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <FormItem
      style={{ color: '#fff' }}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      validateTrigger={validateTrigger}
    >
      <StyledContainer>
        <PhoneInputComponent
          name={name}
          country="de"
          value={value}
          regions="europe"
          alwaysDefaultMask
          disableCountryGuess
          autoFormat={false}
          disableCountryCode
          copyNumbersOnly={false}
          placeholder={placeholder}
          onChange={(inputValue, { dialCode }) => {
            setValue(inputValue);
            onDialCodeChange(dialCode);
          }}
          inputProps={{
            name,
            type: 'tel',
            autocomplete: 'tel-national',
          }}
        />
      </StyledContainer>
    </FormItem>
  );
}
