import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';

import { TextInput } from 'components/TextInput';
import { useNameValidator } from 'hooks/useValidators';

import {
  StyledForm,
  StyledFooter,
  StyledContent,
  StyledInfoText,
  StyledHeadline,
  StyledSecondaryButton,
} from './NameInputStep.styled';

export function NameInputStep({ onSubmit }) {
  const { formatMessage } = useIntl();
  const [isReady, setIsReady] = useState(false);
  const nameValidator = useNameValidator();

  const onValuesChange = useCallback(
    (_, { firstName, lastName }) => setIsReady(firstName && lastName),
    [setIsReady]
  );

  return (
    <StyledForm onFinish={onSubmit} onValuesChange={onValuesChange}>
      <StyledContent data-cy="nameInput">
        <StyledHeadline>
          {formatMessage({ id: 'OnBoarding.NameInputStep.Headline' })}
        </StyledHeadline>
        <StyledInfoText>
          {formatMessage({ id: 'Form.RequiredField.Explanation' })}
        </StyledInfoText>
        <TextInput
          autoFocus
          tabIndex="1"
          name="firstName"
          rules={nameValidator}
          autocomplete="given-name"
          label={formatMessage({ id: 'Form.FirstName.Label' })}
          placeholder={formatMessage({ id: 'Form.FirstName.Placeholder' })}
        />
        <TextInput
          tabIndex="2"
          name="lastName"
          rules={nameValidator}
          autocomplete="family-name"
          label={formatMessage({ id: 'Form.LastName.Label' })}
          placeholder={formatMessage({ id: 'Form.LastName.Placeholder' })}
        />
      </StyledContent>
      <StyledFooter>
        <StyledSecondaryButton
          id="next"
          tabIndex="3"
          htmlType="submit"
          disabled={!isReady}
          data-cy="nameInputSubmit"
        >
          {formatMessage({ id: 'Form.Next' })}
        </StyledSecondaryButton>
      </StyledFooter>
    </StyledForm>
  );
}
