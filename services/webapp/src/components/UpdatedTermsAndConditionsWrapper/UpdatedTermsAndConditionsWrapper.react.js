import React, { useEffect, useState } from 'react';

import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet-async';

import { indexDB } from 'db';

import menu from 'assets/menu.svg';
import lucaLogo from 'assets/LucaLogoWhite.svg';

import { AppContent, AppLayout } from 'components/AppLayout';
import { ResetDeviceModal } from 'components/Settings/ResetDeviceModal';

import { PRIVACY_LINK, TERMS_CONDITIONS_LINK } from 'constants/links';
import { CURRENT_TERMS_AND_CONDITIONS_VERSION } from 'constants/termsAndConditions';

import {
  StyledLink,
  StyledHeadline,
  StyledInfoText,
  StyledLucaLogo,
  StyledMenuIcon,
  StyledPlaceholder,
  StyledPrimaryButton,
  StyledHeaderMenuIconContainer,
} from './UpdatedTermsAndConditionsWrapper.styled';

export function UpdatedTermsAndConditionsWrapper({ children }) {
  const intl = useIntl();
  const [showResetAccount, setShowResetAccount] = useState(false);
  const [hasSeenCurrentVersion, setHasSeenCurrentVersion] = useState(true);

  const onAccept = async () => {
    const [{ userId }] = await indexDB.users.toArray();
    await indexDB.users.where({ userId }).modify({
      lastTermsAndConditionsVersion: CURRENT_TERMS_AND_CONDITIONS_VERSION,
    });
    setHasSeenCurrentVersion(true);
  };

  useEffect(() => {
    indexDB.users
      .toArray()
      .then(([{ lastTermsAndConditionsVersion }]) => {
        if (
          lastTermsAndConditionsVersion === null ||
          lastTermsAndConditionsVersion < CURRENT_TERMS_AND_CONDITIONS_VERSION
        ) {
          setHasSeenCurrentVersion(false);
          return;
        }

        setHasSeenCurrentVersion(true);
      })
      .catch(error => {
        console.error(error);
        setHasSeenCurrentVersion(true);
      });
  }, []);

  if (hasSeenCurrentVersion) {
    return children;
  }

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'Home.PageTitle' })}</title>
      </Helmet>
      <AppLayout
        showBorder={false}
        header={
          <>
            <StyledLucaLogo alt="luca" src={lucaLogo} />
            <StyledHeaderMenuIconContainer
              tabIndex="4"
              id="deleteAccount"
              onClick={() => setShowResetAccount(true)}
              aria-label={intl.formatMessage({
                id: 'Home.AriaSettingsLabel',
              })}
            >
              <StyledMenuIcon src={menu} alt="settings" />
            </StyledHeaderMenuIconContainer>
          </>
        }
        footer={
          <StyledPrimaryButton tabIndex="3" onClick={onAccept}>
            {intl.formatMessage({ id: 'UpdatedTermsAndConditions.Button' })}
          </StyledPrimaryButton>
        }
      >
        <AppContent>
          <StyledHeadline>
            {intl.formatMessage({ id: 'UpdatedTermsAndConditions.Headline' })}
          </StyledHeadline>
          <StyledInfoText>
            {intl.formatMessage({ id: 'UpdatedTermsAndConditions.InfoPart1' })}
          </StyledInfoText>
          <StyledInfoText>
            {intl.formatMessage({ id: 'UpdatedTermsAndConditions.InfoPart2' })}
          </StyledInfoText>
          <StyledPlaceholder />
          <StyledInfoText>
            {intl.formatMessage(
              { id: 'UpdatedTermsAndConditions.Overview' },
              {
                termsAndConditionsLink: (
                  <StyledLink
                    tabIndex="1"
                    rel="noopener"
                    target="_blank"
                    href={TERMS_CONDITIONS_LINK}
                  >
                    {intl.formatMessage({
                      id: 'UpdatedTermsAndConditions.TermsAndConditionsLink',
                    })}
                  </StyledLink>
                ),
                privacyLink: (
                  <StyledLink
                    tabIndex="2"
                    rel="noopener"
                    target="_blank"
                    href={PRIVACY_LINK}
                  >
                    {intl.formatMessage({
                      id: 'UpdatedTermsAndConditions.PrivacyLink',
                    })}
                  </StyledLink>
                ),
              }
            )}
          </StyledInfoText>
        </AppContent>
      </AppLayout>
      {showResetAccount && (
        <ResetDeviceModal onClose={() => setShowResetAccount(false)} />
      )}
    </>
  );
}
