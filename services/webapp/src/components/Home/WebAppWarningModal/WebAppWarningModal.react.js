import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { indexDB } from 'db';
import { SecondaryButton } from 'components/Buttons';
import { CheckBoxWithText } from 'components/CheckBoxWithText';

import download from 'assets/download.svg';
import appStoreLogo from 'assets/appStore.png';
import googlePlayLogo from 'assets/googlePlay.png';

import {
  StyledFooter,
  StyledContent,
  StyledHeadline,
  StyledInfoText,
  StyledContainer,
  StyledStoreLink,
  StyledStoreLogo,
  StyledStoreWrapper,
  StyledDownloadImage,
  StyledModalContainer,
  StyledSubmitButtonWrapper,
} from './WebAppWarningModal.styled';

export function WebAppWarningModal({ onClose }) {
  const { formatMessage } = useIntl();
  const [onlyUseWebApp, setOnlyUseWebApp] = useState(false);

  return (
    <StyledModalContainer>
      <StyledContainer>
        <StyledContent>
          <StyledDownloadImage src={download} />
          <StyledHeadline>
            {formatMessage({ id: 'Home.WebAppWarningModal.Headline' })}
          </StyledHeadline>
          <StyledInfoText>
            {formatMessage({ id: 'Home.WebAppWarningModal.Description' })}
          </StyledInfoText>
          <StyledStoreWrapper>
            <StyledStoreLink
              rel="noopener noreferrer"
              href="https://apps.apple.com/de/app/luca-app/id1531742708"
            >
              <StyledStoreLogo src={appStoreLogo} alt="Apple App Store" />
            </StyledStoreLink>
            <StyledStoreLink
              rel="noopener noreferrer"
              href="https://play.google.com/store/apps/details?id=de.culture4life.luca"
            >
              <StyledStoreLogo src={googlePlayLogo} alt="Google Play" />
            </StyledStoreLink>
          </StyledStoreWrapper>
        </StyledContent>
        <StyledFooter>
          <CheckBoxWithText
            tabIndex="3"
            color="#000"
            id="privacyCheckbox"
            testId="privacyCheckbox"
            checked={onlyUseWebApp}
            onChange={() => setOnlyUseWebApp(!onlyUseWebApp)}
            description={formatMessage({
              id: 'Home.WebAppWarningModal.Checkbox',
            })}
          />
          <StyledSubmitButtonWrapper>
            <SecondaryButton
              tabIndex="1"
              id="okay"
              onClick={async () => {
                if (onlyUseWebApp) {
                  const [user] = await indexDB.users.toArray();
                  await indexDB.users
                    .where({ userId: user.userId })
                    .modify({ useWebApp: true });
                }
                onClose();
              }}
            >
              {formatMessage({ id: 'Home.WebAppWarningModal.Submit' })}
            </SecondaryButton>
          </StyledSubmitButtonWrapper>
        </StyledFooter>
      </StyledContainer>
    </StyledModalContainer>
  );
}
