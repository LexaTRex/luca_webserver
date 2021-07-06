import React from 'react';

import { useIntl } from 'react-intl';

import { Link } from 'components/Text';
import { SHARE_DATA_INFO_LINK } from 'constants/links';

import {
  StyledFooter,
  StyledContent,
  StyledContainer,
  StyledHeadline,
  StyledInfoText,
  StyledCancelButton,
  StyledShareButton,
  StyledModalContainer,
} from './HistoryShareConsentModal.styled';

export function HistoryShareConsentModal({ onClose, next }) {
  const { formatMessage } = useIntl();

  const shareDataInfoLink = (
    <Link href={SHARE_DATA_INFO_LINK} target="_blank">
      {formatMessage({
        id: 'HistoryShareConsentModal.Link',
      })}
    </Link>
  );

  return (
    <StyledModalContainer>
      <StyledContainer>
        <StyledContent>
          <StyledHeadline>
            {formatMessage({ id: 'HistoryShareConsentModal.Headline' })}
          </StyledHeadline>
          <StyledInfoText>
            {formatMessage(
              { id: 'HistoryShareConsentModal.Description' },
              {
                link: shareDataInfoLink,
              }
            )}
          </StyledInfoText>
        </StyledContent>
        <StyledFooter>
          <StyledCancelButton id="closeModal" tabIndex="1" onClick={onClose}>
            {formatMessage({ id: 'HistoryShareConsentModal.Cancel' })}
          </StyledCancelButton>
          <StyledShareButton id="closeModal" tabIndex="1" onClick={next}>
            {formatMessage({ id: 'HistoryShareConsentModal.Share' })}
          </StyledShareButton>
        </StyledFooter>
      </StyledContainer>
    </StyledModalContainer>
  );
}
