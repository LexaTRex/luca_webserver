import React from 'react';

import helloImage from 'assets/hello.png';
import appStoreLogo from 'assets/appStore.png';
import lucaLogo from 'assets/LucaLogo.svg';
import googlePlayLogo from 'assets/googlePlay.png';

import { useIntl } from 'react-intl';
import {
  StyledFooter,
  StyledContent,
  StyledInfoText,
  StyledLucaLogo,
  StyledHeadline,
  StyledStoreLogo,
  StyledStoreLink,
  StyledContainer,
  StyledHelloImage,
  StyledStoreWrapper,
  StyledPrimaryButton,
} from './WebAppWarningStep.styled';

export function WebAppWarningStep({ onSubmit }) {
  const intl = useIntl();

  return (
    <StyledContainer>
      <StyledContent>
        <StyledLucaLogo alt="luca" src={lucaLogo} />
        <StyledHelloImage src={helloImage} />
        <StyledHeadline>
          {intl.formatMessage({ id: 'OnBoarding.WebAppWarningStep.Headline' })}
        </StyledHeadline>
        <StyledInfoText>
          {intl.formatMessage({
            id: 'OnBoarding.WebAppWarningStep.Description',
          })}
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
        <StyledPrimaryButton
          id="next"
          tabIndex="5"
          onClick={onSubmit}
          data-cy="ignoreWarning"
        >
          {intl.formatMessage({ id: 'OnBoarding.WebAppWarningStep.Submit' })}
        </StyledPrimaryButton>
      </StyledFooter>
    </StyledContainer>
  );
}
