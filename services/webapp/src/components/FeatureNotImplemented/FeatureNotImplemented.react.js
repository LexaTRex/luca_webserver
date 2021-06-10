import React from 'react';
import { AppLayout } from 'components/AppLayout';

import appStoreLogo from 'assets/appStore.png';
import lucaLogo from 'assets/LucaLogoWhite.svg';
import googlePlayLogo from 'assets/googlePlay.png';
import missingFeature from 'assets/missingFeature.svg';

import { useIntl } from 'react-intl';
import {
  StyledText,
  StyledContent,
  StyledHeadline,
  StyledLucaLogo,
  StyledStoreLogo,
  StyledStoreLink,
  StyledStoreWrapper,
  StyledMissingFeatureLogo,
} from './FeatureNotImplemented.styled';

export function FeatureNotImplemented() {
  const intl = useIntl();

  return (
    <AppLayout header={<StyledLucaLogo src={lucaLogo} />}>
      <StyledContent>
        <StyledHeadline>
          {intl.formatMessage({ id: 'FeatureNotImplemented.Headline' })}
        </StyledHeadline>
        <StyledText>
          {intl.formatMessage({ id: 'FeatureNotImplemented.Description' })}
        </StyledText>
        <StyledMissingFeatureLogo
          src={missingFeature}
          alt="Missing Feature Logo"
        />
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
    </AppLayout>
  );
}
