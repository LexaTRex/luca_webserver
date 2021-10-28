import React from 'react';
import { useIntl } from 'react-intl';

import { Success, PrimaryButton } from 'components/general';

import { Wrapper, Heading, Text, ButtonWrapper } from './FinishStep.styled';

export const FinishStep = ({ done }) => {
  const intl = useIntl();

  return (
    <Wrapper data-cy="successNotificationModal">
      <Success />
      <Heading>
        {intl.formatMessage({ id: 'contactForm.modal.success.heading' })}
      </Heading>
      <Text>
        {intl.formatMessage({ id: 'contactForm.modal.success.text' })}
      </Text>
      <ButtonWrapper>
        <PrimaryButton onClick={done}>
          {intl.formatMessage({ id: 'contactForm.modal.success.button' })}
        </PrimaryButton>
      </ButtonWrapper>
    </Wrapper>
  );
};
