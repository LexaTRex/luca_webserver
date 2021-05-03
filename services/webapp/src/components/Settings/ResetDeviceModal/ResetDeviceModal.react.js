import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { indexDB } from 'db';
import { ON_BOARDING_PATH } from 'constants/routes';

import {
  StyledContent,
  StyledHeadline,
  StyledInfoText,
  StyledContainer,
  StyledCancelButton,
  StyledSubmitButton,
  StyledModalContainer,
} from './ResetDeviceModal.styled';

export function ResetDeviceModal({ onClose }) {
  const history = useHistory();
  const { formatMessage } = useIntl();

  return (
    <StyledModalContainer>
      <StyledContainer>
        <StyledHeadline>
          {formatMessage({ id: 'Data.DeleteAccount.Title' })}
        </StyledHeadline>
        <StyledContent>
          <StyledInfoText>
            {formatMessage({ id: 'Data.DeleteAccount.Description' })}
          </StyledInfoText>
        </StyledContent>
        <StyledCancelButton
          onClick={() => {
            indexDB.delete();
            history.push(ON_BOARDING_PATH);
            window.location.reload();
          }}
        >
          {formatMessage({ id: 'Data.DeleteAccount.Confirm' })}
        </StyledCancelButton>
        <StyledSubmitButton onClick={onClose}>
          {formatMessage({ id: 'Data.DeleteAccount.Cancel' })}
        </StyledSubmitButton>
      </StyledContainer>
    </StyledModalContainer>
  );
}
