import React from 'react';
import { useIntl } from 'react-intl';

import { TextInput } from '../../TextInput';
import { requiredFieldValidation } from '../../../form/validations';

import {
  StyledForm,
  StyledFooter,
  StyledContent,
  StyledHeadline,
  StyledInfoText,
  StyledSecondaryButton,
} from './LocationInputStep.styled';

export function LocationInputStep({ onSubmit }) {
  const { formatMessage } = useIntl();

  return (
    <StyledForm onFinish={onSubmit}>
      <StyledContent>
        <StyledHeadline>
          {formatMessage({ id: 'OnBoarding.LocationInputStep.Headline' })}
        </StyledHeadline>
        <StyledInfoText>
          {formatMessage({ id: 'OnBoarding.LocationInputStep.Description' })}
        </StyledInfoText>
        <TextInput
          name="street"
          autocomplete="address-line1"
          placeholder={formatMessage({ id: 'Form.Street' })}
          rules={requiredFieldValidation(formatMessage)}
        />
        <TextInput
          name="houseNumber"
          autocomplete="address-line2"
          rules={requiredFieldValidation(formatMessage)}
          placeholder={formatMessage({ id: 'Form.HouseNumber' })}
        />
        <TextInput
          name="zip"
          autocomplete="postal-code"
          maxLength="5"
          placeholder={formatMessage({ id: 'Form.Zip' })}
          rules={requiredFieldValidation(formatMessage)}
        />
        <TextInput
          name="city"
          autocomplete="address-level2"
          placeholder={formatMessage({ id: 'Form.City' })}
          rules={requiredFieldValidation(formatMessage)}
        />
      </StyledContent>
      <StyledFooter>
        <StyledSecondaryButton htmlType="submit">
          {formatMessage({ id: 'Form.Next' })}
        </StyledSecondaryButton>
      </StyledFooter>
    </StyledForm>
  );
}
