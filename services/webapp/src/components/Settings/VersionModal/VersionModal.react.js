import React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { getVersion } from 'network/static';

import { PrimaryButton } from 'components/Buttons';
import {
  StyledContent,
  StyledHeadline,
  StyledInfoText,
  StyledContainer,
  StyledModalContainer,
} from './VersionModal.styled';

export function VersionModal({ onClose }) {
  const { formatMessage } = useIntl();

  const { isSuccess, data: info } = useQuery('version', getVersion);

  return (
    <StyledModalContainer>
      <StyledContainer>
        <StyledHeadline>
          {formatMessage({ id: 'version.modal.title' })}
        </StyledHeadline>
        <StyledContent>
          <StyledInfoText>
            {isSuccess && (
              <>
                luca Webapp
                <br />
                <br />
                {info.version}
                <br />
                {`#${info.commit}`}
              </>
            )}
          </StyledInfoText>
        </StyledContent>
        <PrimaryButton id="ok" tabIndex="0" onClick={onClose}>
          {formatMessage({ id: 'Home.WebAppWarningModal.Submit' })}
        </PrimaryButton>
      </StyledContainer>
    </StyledModalContainer>
  );
}
