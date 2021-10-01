import React from 'react';
import { useIntl } from 'react-intl';
import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';

import { ButtonWrapper } from '../Onboarding.styled';

export const YesNoSelection = ({ onYes, onNo, onBack }) => {
  const intl = useIntl();

  return (
    <ButtonWrapper multipleButtons>
      <SecondaryButton onClick={onBack}>
        {intl.formatMessage({
          id: 'authentication.form.button.back',
        })}
      </SecondaryButton>
      <div>
        <PrimaryButton
          data-cy="no"
          $isButtonWhite
          style={{ marginRight: 24 }}
          onClick={onNo}
        >
          {intl.formatMessage({
            id: 'no',
          })}
        </PrimaryButton>
        <PrimaryButton data-cy="yes" onClick={onYes}>
          {intl.formatMessage({
            id: 'yes',
          })}
        </PrimaryButton>
      </div>
    </ButtonWrapper>
  );
};
