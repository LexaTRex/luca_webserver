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
        <StyledSubmitButton
          tabIndex="1"
          id="createPrivateMeeting"
          onClick={onCheck}
        >
          {formatMessage({ id: 'HostPrivateMeetingWarningModal.Submit' })}
        </StyledSubmitButton>
        <StyledCancelButton
          tabIndex="1"
          id="cancelPrivateMeeting"
          onClick={onCancel}
        >
          {formatMessage({ id: 'HostPrivateMeetingWarningModal.Cancel' })}
        </StyledCancelButton>
      </StyledContainer>
    </StyledModalContainer>
  );
}
