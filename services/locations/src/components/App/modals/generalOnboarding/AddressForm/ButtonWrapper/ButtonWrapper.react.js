import React from 'react';
import { useIntl } from 'react-intl';
import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';
import { Wrapper } from './ButtonWrapper.styled';

export const ButtonWrapper = ({ close, disabled }) => {
  const intl = useIntl();
  return (
    <Wrapper multipleButtons>
      <SecondaryButton onClick={close}>
        {intl.formatMessage({
          id: 'account.delete.cancel',
        })}
      </SecondaryButton>
      <PrimaryButton
        data-cy="saveAddress"
        disabled={disabled}
        htmlType="submit"
      >
        {intl.formatMessage({
          id: 'location.save',
        })}
      </PrimaryButton>
    </Wrapper>
  );
};
