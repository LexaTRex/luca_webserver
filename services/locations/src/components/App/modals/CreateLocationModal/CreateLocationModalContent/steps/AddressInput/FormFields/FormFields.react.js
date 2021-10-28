import React from 'react';

import { useFormFields } from 'components/hooks/useFormFieldsHelper';

import { InnerForm, FormColum } from './FormFields.styled';
import { InputField } from './InputField';
import { HiddenInputs } from './HiddenInputs';

export const FormFields = ({ show, disabled }) => {
  const ADDRESS_FIELDS = useFormFields();
  return (
    <InnerForm show={show}>
      <FormColum>
        {ADDRESS_FIELDS.map(({ fieldName, validator }) => (
          <InputField
            key={fieldName}
            name={fieldName}
            validator={validator}
            disabled={disabled}
          />
        ))}
      </FormColum>
      <HiddenInputs />
    </InnerForm>
  );
};
