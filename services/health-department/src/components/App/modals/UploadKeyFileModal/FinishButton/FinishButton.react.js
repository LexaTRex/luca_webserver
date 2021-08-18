import React from 'react';
import { useIntl } from 'react-intl';
import { PrimaryButton } from 'components/general';
import { FinishButtonWrapper } from './FinishButton.styled';

export const FinishButton = ({ reset, uploadStatus, exception }) => {
  const intl = useIntl();
  return (
    <FinishButtonWrapper>
      <PrimaryButton
        data-cy="tryAgain"
        onClick={reset}
        hidden={uploadStatus !== exception}
      >
        {intl.formatMessage({
          id: 'uploadKey.tryAgain',
        })}
      </PrimaryButton>
    </FinishButtonWrapper>
  );
};
