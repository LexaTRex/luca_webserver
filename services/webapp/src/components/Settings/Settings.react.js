import React, { useState } from 'react';

import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';

import menu from 'assets/menu.svg';
import {
  HOME_PATH,
  LICENSES_ROUTE,
  REPOSITORY_URL,
  EDIT_CONTACT_INFORMATION_SETTING,
} from 'constants/routes';

import { PRIVACY_LINK, TERMS_CONDITIONS_LINK } from 'constants/links';
import { AppContent, AppHeadline, AppLayout } from 'components/AppLayout';

import {
  StyledMenuIcon,
  StyledHeaderMenuIconContainer,
  StyledSettingsButton,
  StyledBackButton,
} from './Settings.styled';

import { ResetDeviceModal } from './ResetDeviceModal/ResetDeviceModal.react';
import { VersionModal } from './VersionModal/VersionModal.react';

export function Settings() {
  const intl = useIntl();
  const history = useHistory();
  const [showResetAccount, setShowResetAccount] = useState(false);
  const [showVersion, setShowVersion] = useState(false);

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'Settings.PageTitle' })}</title>
      </Helmet>
      <AppLayout
        header={
          <>
            <AppHeadline>
              {intl.formatMessage({ id: 'Settings.Headline' })}
            </AppHeadline>
            <StyledHeaderMenuIconContainer
              id="close"
              onClick={() => history.push(HOME_PATH)}
            >
              <StyledMenuIcon alt="close" src={menu} />
            </StyledHeaderMenuIconContainer>
          </>
        }
        footer={
          <>
            <StyledBackButton
              id="close"
              onClick={() => history.push(HOME_PATH)}
            >
              {intl.formatMessage({ id: 'Settings.Back' })}
            </StyledBackButton>
          </>
        }
      >
        <AppContent noCentering>
          <StyledSettingsButton
            id="editContactInformations"
            onClick={() => history.push(EDIT_CONTACT_INFORMATION_SETTING)}
          >
            {intl.formatMessage({ id: 'Settings.ContactInformation' })}
          </StyledSettingsButton>
          <StyledSettingsButton
            id="privacy"
            onClick={() => window.open(PRIVACY_LINK, '_blank')}
          >
            {intl.formatMessage({ id: 'Settings.Privacy' })}
          </StyledSettingsButton>
          <StyledSettingsButton
            id="termsAndConditions"
            onClick={() => window.open(TERMS_CONDITIONS_LINK, '_blank')}
          >
            {intl.formatMessage({ id: 'Settings.TermsOfService' })}
          </StyledSettingsButton>
          <StyledSettingsButton
            id="repository"
            onClick={() => window.open(REPOSITORY_URL, '_blank')}
          >
            {intl.formatMessage({ id: 'Settings.Repository' })}
          </StyledSettingsButton>
          <StyledSettingsButton
            id="version"
            onClick={() => setShowVersion(true)}
          >
            {intl.formatMessage({ id: 'version.version' })}
          </StyledSettingsButton>
          <StyledSettingsButton
            id="licenses"
            onClick={() => window.open(LICENSES_ROUTE, '_blank')}
          >
            {intl.formatMessage({ id: 'license.license' })}
          </StyledSettingsButton>
          <StyledSettingsButton
            id="delete"
            onClick={() => setShowResetAccount(true)}
          >
            {intl.formatMessage({ id: 'Data.DeleteAccount.Title' })}
          </StyledSettingsButton>
        </AppContent>
      </AppLayout>
      {showResetAccount && (
        <ResetDeviceModal onClose={() => setShowResetAccount(false)} />
      )}
      {showVersion && <VersionModal onClose={() => setShowVersion(false)} />}
    </>
  );
}
