import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import menu from 'assets/menu.svg';
import {
  HOME_PATH,
  EDIT_CONTACT_INFORMATION_SETTING,
  LICENSES_ROUTE,
} from 'constants/routes';

import { AppContent, AppHeadline, AppLayout } from '../AppLayout';

import {
  StyledMenuIcon,
  StyledHeaderMenuIconContainer,
  StyledSettingsButton,
  StyledBackButton,
} from './Settings.styled';

import { ResetDeviceModal } from './ResetDeviceModal/ResetDeviceModal.react';

export function Settings() {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [showResetAccount, setShowResetAccount] = useState(false);

  return (
    <>
      <AppLayout
        header={
          <>
            <AppHeadline>
              {formatMessage({ id: 'Settings.Headline' })}
            </AppHeadline>
            <StyledHeaderMenuIconContainer>
              <StyledMenuIcon
                src={menu}
                onClick={() => history.push(HOME_PATH)}
              />
            </StyledHeaderMenuIconContainer>
          </>
        }
        footer={
          <>
            <StyledBackButton onClick={() => history.push(HOME_PATH)}>
              {formatMessage({ id: 'Settings.Back' })}
            </StyledBackButton>
          </>
        }
      >
        <AppContent noCentering>
          <StyledSettingsButton
            onClick={() => history.push(EDIT_CONTACT_INFORMATION_SETTING)}
          >
            {formatMessage({ id: 'Settings.ContactInformation' })}
          </StyledSettingsButton>
          <StyledSettingsButton
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
            onClick={() => window.open(LICENSES_ROUTE, '_blank')}
          >
            {formatMessage({ id: 'license.license' })}
          </StyledSettingsButton>
          <StyledSettingsButton onClick={() => setShowResetAccount(true)}>
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
