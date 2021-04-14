import React from 'react';

import { useIntl } from 'react-intl';
import {
  StyledContent,
  StyledHeadline,
  StyledInfoText,
  StyledContainer,
  StyledCancelButton,
  StyledSubmitButton,
  StyledModalContainer,
} from './PrivateMeetingWarningModal.styled';

export function PrivateMeetingWarningModal({ onCheck, onCancel }) {
  const { formatMessage } = useIntl();

  return (
    <StyledModalContainer>
      <StyledContainer>
        <StyledContent>
          <StyledHeadline>
            {formatMessage({ id: 'PrivateMeetingWarningModal.Headline' })}
          </StyledHeadline>
          <StyledInfoText>
            {formatMessage({ id: 'PrivateMeetingWarningModal.Description' })}
          </StyledInfoText>
        </StyledContent>
        <StyledSubmitButton onClick={onCheck}>
          {formatMessage({ id: 'PrivateMeetingWarningModal.Submit' })}
        </StyledSubmitButton>
        <StyledCancelButton onClick={onCancel}>
          {formatMessage({ id: 'PrivateMeetingWarningModal.Close' })}
        </StyledCancelButton>
      </StyledContainer>
    </StyledModalContainer>
  );
}
