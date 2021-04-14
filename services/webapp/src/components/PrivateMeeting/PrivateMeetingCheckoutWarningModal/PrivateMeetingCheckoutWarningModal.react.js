import React from 'react';

import { useIntl } from 'react-intl';
import {
  StyledFooter,
  StyledContent,
  StyledHeadline,
  StyledInfoText,
  StyledContainer,
  StyledCancelButton,
  StyledSubmitButton,
  StyledModalContainer,
  StyledFooterPlaceholder,
} from './PrivateMeetingCheckoutWarningModal.styled';

export function PrivateMeetingCheckoutWarningModal({ onCancel, onSumit }) {
  const { formatMessage } = useIntl();

  return (
    <StyledModalContainer>
      <StyledContainer>
        <StyledContent>
          <StyledHeadline>
            {formatMessage({
              id: 'PrivateMeetingCheckoutWarningModal.Headline',
            })}
          </StyledHeadline>
          <StyledInfoText>
            {formatMessage({
              id: 'PrivateMeetingCheckoutWarningModal.Description',
            })}
          </StyledInfoText>
        </StyledContent>
        <StyledFooter>
          <StyledCancelButton onClick={onCancel}>
            {formatMessage({ id: 'PrivateMeetingCheckoutWarningModal.Cancel' })}
          </StyledCancelButton>
          <StyledFooterPlaceholder />
          <StyledSubmitButton onClick={onSumit}>
            {formatMessage({ id: 'PrivateMeetingCheckoutWarningModal.Submit' })}
          </StyledSubmitButton>
        </StyledFooter>
      </StyledContainer>
    </StyledModalContainer>
  );
}
