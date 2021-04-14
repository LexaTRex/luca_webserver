import React from 'react';

import { useIntl } from 'react-intl';
import {
  StyledContent,
  StyledHeadline,
  StyledInfoText,
  StyledContainer,
  StyledCloseButton,
  StyledModalContainer,
} from './PrivateMeetingInfoModal.styled';

export function PrivateMeetingInfoModal({ onClose = () => {} }) {
  const { formatMessage } = useIntl();

  return (
    <StyledModalContainer>
      <StyledContainer>
        <StyledContent>
          <StyledHeadline>
            {formatMessage({ id: 'PrivateMeetingInfoModal.Headline' })}
          </StyledHeadline>
          <StyledInfoText>
            {formatMessage({ id: 'PrivateMeetingInfoModal.Description' })}
          </StyledInfoText>
        </StyledContent>
        <StyledCloseButton onClick={onClose}>
          {formatMessage({ id: 'Modal.Close' })}
        </StyledCloseButton>
      </StyledContainer>
    </StyledModalContainer>
  );
}
