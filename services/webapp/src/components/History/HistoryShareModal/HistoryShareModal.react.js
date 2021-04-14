import React from 'react';

import { useIntl } from 'react-intl';
import {
  StyledTan,
  StyledContent,
  StyledContainer,
  StyledTanHeadline,
  StyledTanInfoText,
  StyledCloseButton,
  StyledModalContainer,
} from './HistoryShareModal.styled';

export function HistoryShareModal({ tan = '', onClose }) {
  const { formatMessage } = useIntl();

  return (
    <StyledModalContainer>
      <StyledContainer>
        <StyledContent>
          <StyledTanHeadline>
            {formatMessage({ id: 'HistoryShareModel.Headline' })}
          </StyledTanHeadline>
          <StyledTanInfoText>
            {formatMessage({ id: 'HistoryShareModel.Description' })}
          </StyledTanInfoText>
          <StyledTan>
            {tan.slice(0, 4)}-{tan.slice(4, 8)}-{tan.slice(8, 12)}
          </StyledTan>
        </StyledContent>
        <StyledCloseButton onClick={onClose}>
          {formatMessage({ id: 'HistoryShareModel.Submit' })}
        </StyledCloseButton>
      </StyledContainer>
    </StyledModalContainer>
  );
}
