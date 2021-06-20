import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';

import { TextInput } from 'components/TextInput';
import { MAX_NAME_LENGTH } from 'constants/valueLength';

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
          autocomplete="given-name"
          label={formatMessage({ id: 'Form.FirstName.Label' })}
          placeholder={formatMessage({ id: 'Form.FirstName.Placeholder' })}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'Form.Validation.isRequired' }),
            },
            {
              max: MAX_NAME_LENGTH,
              message: formatMessage({ id: 'Form.Validation.toLong' }),
            },
          ]}
        />
        <TextInput
          tabIndex="2"
          name="lastName"
          autocomplete="family-name"
          label={formatMessage({ id: 'Form.LastName.Label' })}
          placeholder={formatMessage({ id: 'Form.LastName.Placeholder' })}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'Form.Validation.isRequired' }),
            },
            {
              max: MAX_NAME_LENGTH,
              message: formatMessage({ id: 'Form.Validation.toLong' }),
            },
          ]}
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
