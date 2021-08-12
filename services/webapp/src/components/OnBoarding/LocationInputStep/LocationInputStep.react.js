import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';

import {
  useCityValidator,
  useHouseNumberValidator,
  useStreetValidator,
  useZipCodeValidator,
} from 'hooks/useValidators';
import { TextInput } from 'components/TextInput';

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

  const cityValidator = useCityValidator();
  const streetValidator = useStreetValidator();
  const zipCodeValidator = useZipCodeValidator();
  const houseNumberValidator = useHouseNumberValidator();

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
          rules={streetValidator}
          autocomplete="address-line1"
          label={formatMessage({ id: 'Form.Street.Label' })}
          placeholder={formatMessage({ id: 'Form.Street.Placeholder' })}
        />
        <TextInput
          name="houseNumber"
          autocomplete="address-line2"
          rules={houseNumberValidator}
          label={formatMessage({ id: 'Form.HouseNumber.Label' })}
          placeholder={formatMessage({ id: 'Form.HouseNumber.Placeholder' })}
        />
        <TextInput
          name="zip"
          maxLength="5"
          rules={zipCodeValidator}
          autocomplete="postal-code"
          label={formatMessage({ id: 'Form.Zip.Label' })}
          placeholder={formatMessage({ id: 'Form.Zip.Placeholder' })}
        />
        <TextInput
          name="city"
          rules={cityValidator}
          autocomplete="address-level2"
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
