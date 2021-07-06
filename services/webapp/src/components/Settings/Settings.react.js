import React, { useState } from 'react';

import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';

import menu from 'assets/menu.svg';
import {
  HOME_PATH,
  LICENSES_ROUTE,
  REPOSITORY_URL,
  EDIT_CONTACT_INFORMATION_SETTING,
} from 'constants/routes';
import { AppContent, AppHeadline, AppLayout } from 'components/AppLayout';

import {
  StyledMenuIcon,
  StyledHeaderMenuIconContainer,
  StyledSettingsButton,
  StyledBackButton,
} from './Settings.styled';

import { ResetDeviceModal } from './ResetDeviceModal/ResetDeviceModal.react';

export function Settings() {
  const intl = useIntl();
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [showResetAccount, setShowResetAccount] = useState(false);

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'Settings.PageTitle' })}</title>
      </Helmet>
      <AppLayout
        header={
          <>
            <AppHeadline>
              {formatMessage({ id: 'Settings.Headline' })}
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
              {formatMessage({ id: 'Settings.Back' })}
            </StyledBackButton>
          </>
        }
      >
        <AppContent noCentering>
          <StyledSettingsButton
            id="editContactInformations"
            onClick={() => history.push(EDIT_CONTACT_INFORMATION_SETTING)}
          >
            {formatMessage({ id: 'Settings.ContactInformation' })}
          </StyledSettingsButton>
          <StyledSettingsButton
            id="privacy"
            onClick={() =>
              window.open(
                formatMessage({
                  id: 'OnBoarding.privacyLink',
                }),
                '_blank'
              )
            }
          >
            {formatMessage({ id: 'Settings.Privacy' })}
          </StyledSettingsButton>
          <StyledSettingsButton
            id="termsAndConditions"
            onClick={() =>
              window.open(
                formatMessage({
                  id: 'OnBoarding.termsAndConditionsLink',
                }),
                '_blank'
              )
            }
          >
            {formatMessage({ id: 'Settings.TermsOfService' })}
          </StyledSettingsButton>
          <StyledSettingsButton
            id="repository"
            onClick={() => window.open(REPOSITORY_URL, '_blank')}
          >
            {formatMessage({ id: 'Settings.Repository' })}
          </StyledSettingsButton>
          <StyledSettingsButton
            id="licenses"
            onClick={() => window.open(LICENSES_ROUTE, '_blank')}
          >
            {formatMessage({ id: 'license.license' })}
          </StyledSettingsButton>
          <StyledSettingsButton
            id="delete"
            onClick={() => setShowResetAccount(true)}
          >
            {formatMessage({ id: 'Data.DeleteAccount.Title' })}
          </StyledSettingsButton>
        </AppContent>
      </AppLayout>
      {showResetAccount && (
        <ResetDeviceModal onClose={() => setShowResetAccount(false)} />
      )}
    </>
  );
}
