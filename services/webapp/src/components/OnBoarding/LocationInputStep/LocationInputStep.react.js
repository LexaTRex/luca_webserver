import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';

import { TextInput } from 'components/TextInput';
import {
  MAX_CITY_LENGTH,
  MAX_STREET_LENGTH,
  MAX_POSTAL_CODE_LENGTH,
  MAX_HOUSE_NUMBER_LENGTH,
} from 'constants/valueLength';

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
  const [isReady, setIsReady] = useState(false);

  const onValuesChange = useCallback(
    (_, { street, houseNumber, zip, city }) =>
      setIsReady(street && houseNumber && zip && city),
    [setIsReady]
  );

  return (
    <StyledForm onFinish={onSubmit} onValuesChange={onValuesChange}>
      <StyledContent data-cy="locationInput">
        <StyledHeadline>
          {formatMessage({ id: 'OnBoarding.LocationInputStep.Headline' })}
        </StyledHeadline>
        <StyledInfoText>
          {formatMessage({ id: 'Form.RequiredField.Explanation' })}
        </StyledInfoText>
        <StyledInfoText>
          {formatMessage({ id: 'OnBoarding.LocationInputStep.Description' })}
        </StyledInfoText>
        <TextInput
          autoFocus
          name="street"
          autocomplete="address-line1"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'Form.Validation.isRequired' }),
            },
            {
              max: MAX_STREET_LENGTH,
              message: formatMessage({ id: 'Form.Validation.toLong' }),
            },
          ]}
          label={formatMessage({ id: 'Form.Street.Label' })}
          placeholder={formatMessage({ id: 'Form.Street.Placeholder' })}
        />
        <TextInput
          name="houseNumber"
          autocomplete="address-line2"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'Form.Validation.isRequired' }),
            },
            {
              max: MAX_HOUSE_NUMBER_LENGTH,
              message: formatMessage({ id: 'Form.Validation.toLong' }),
            },
          ]}
          label={formatMessage({ id: 'Form.HouseNumber.Label' })}
          placeholder={formatMessage({ id: 'Form.HouseNumber.Placeholder' })}
        />
        <TextInput
          name="zip"
          autocomplete="postal-code"
          maxLength="5"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'Form.Validation.isRequired' }),
            },
            {
              max: MAX_POSTAL_CODE_LENGTH,
              message: formatMessage({ id: 'Form.Validation.toLong' }),
            },
          ]}
          label={formatMessage({ id: 'Form.Zip.Label' })}
          placeholder={formatMessage({ id: 'Form.Zip.Placeholder' })}
        />
        <TextInput
          name="city"
          autocomplete="address-level2"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'Form.Validation.isRequired' }),
            },
            {
              max: MAX_CITY_LENGTH,
              message: formatMessage({ id: 'Form.Validation.toLong' }),
            },
          ]}
          label={formatMessage({ id: 'Form.City.Label' })}
          placeholder={formatMessage({ id: 'Form.City.Placeholder' })}
        />
      </StyledContent>
      <StyledFooter>
        <StyledSecondaryButton
          id="next"
          htmlType="submit"
          disabled={!isReady}
          data-cy="locationInputSubmit"
        >
          {formatMessage({ id: 'Form.Next' })}
        </StyledSecondaryButton>
      </StyledFooter>
    </StyledForm>
  );
}
