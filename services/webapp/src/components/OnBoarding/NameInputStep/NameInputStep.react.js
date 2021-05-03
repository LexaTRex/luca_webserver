import React from 'react';
import { useIntl } from 'react-intl';

import {
  StyledForm,
  StyledFooter,
  StyledContent,
  StyledHeadline,
  StyledSecondaryButton,
} from './NameInputStep.styled';
import { TextInput } from '../../TextInput';

export function NameInputStep({ onSubmit }) {
  const { formatMessage } = useIntl();

  return (
    <StyledForm onFinish={onSubmit}>
      <StyledContent data-cy="nameInput">
        <StyledHeadline>
          {formatMessage({ id: 'OnBoarding.NameInputStep.Headline' })}
        </StyledHeadline>
        <TextInput
          name="firstName"
          autocomplete="given-name"
          placeholder={formatMessage({ id: 'Form.FirstName' })}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'Form.Validation.isRequired' }),
            },
          ]}
        />
        <TextInput
          name="lastName"
          autocomplete="family-name"
          placeholder={formatMessage({ id: 'Form.LastName' })}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'Form.Validation.isRequired' }),
            },
          ]}
        />
      </StyledContent>
      <StyledFooter>
        <StyledSecondaryButton htmlType="submit" data-cy="nameInputSubmit">
          {formatMessage({ id: 'Form.Next' })}
        </StyledSecondaryButton>
      </StyledFooter>
    </StyledForm>
  );
}
