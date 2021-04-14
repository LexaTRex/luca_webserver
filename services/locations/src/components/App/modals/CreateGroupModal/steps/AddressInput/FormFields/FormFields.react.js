import React from 'react';

import { ADDRESS_FIELDS } from './FormFields.helper';
import { InnerForm, FormColum } from './FormFields.styled';
import { InputField } from './InputField';
import { HiddenInputs } from './HiddenInputs';

export const FormFields = ({ show = false, disabled }) => {
  return (
    <InnerForm show={show}>
      <FormColum>
        {ADDRESS_FIELDS.map(address => (
          <InputField key={address} name={address} disabled={disabled} />
        ))}
      </FormColum>
      <HiddenInputs />
    </InnerForm>
  );
};
