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
} from './HostPrivateMeetingWarningModal.styled';

export function HostPrivateMeetingWarningModal({ onCheck, onCancel }) {
  const { formatMessage } = useIntl();

  return (
    <StyledModalContainer>
      <StyledContainer>
        <StyledContent>
          <StyledHeadline>
            {formatMessage({ id: 'HostPrivateMeetingWarningModal.Headline' })}
          </StyledHeadline>
          <StyledInfoText>
            {formatMessage({
              id: 'HostPrivateMeetingWarningModal.Description',
            })}
          </StyledInfoText>
        </StyledContent>
        <StyledSubmitButton onClick={onCheck}>
          {formatMessage({ id: 'HostPrivateMeetingWarningModal.Submit' })}
        </StyledSubmitButton>
        <StyledCancelButton onClick={onCancel}>
          {formatMessage({ id: 'HostPrivateMeetingWarningModal.Cancel' })}
        </StyledCancelButton>
      </StyledContainer>
    </StyledModalContainer>
  );
}
