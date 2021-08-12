import React from 'react';
import { useIntl } from 'react-intl';
import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';
import { FinishButtonWrapper } from './FinishButton.styled';

export const FinishButton = ({
  uploadStatus,
  uploadException,
  correctKeyInserted,
  confirmKey,
  reset,
}) => {
  const intl = useIntl();

  return (
    <FinishButtonWrapper
      align={uploadStatus !== uploadException ? 'flex-end' : 'space-between'}
    >
      <SecondaryButton
        data-cy="regenerateKey"
        onClick={reset}
        hidden={uploadStatus !== uploadException}
      >
        {intl.formatMessage({
          id: 'modal.registerOperator.keyTestGenerateKey',
        })}
      </SecondaryButton>
      <PrimaryButton
        data-cy="complete"
        onClick={() => confirmKey()}
        disabled={!correctKeyInserted}
      >
        {intl.formatMessage({
          id: 'modal.registerOperator.keyTestConfirm',
        })}
      </PrimaryButton>
    </FinishButtonWrapper>
  );
};
