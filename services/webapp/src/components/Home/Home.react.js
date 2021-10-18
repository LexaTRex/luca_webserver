import React, { useEffect, useState } from 'react';

import QRCode from 'qrcode.react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';

import { indexDB } from 'db';
import {
  BASE_PRIVATE_MEETING_PATH,
  HISTORY_PATH,
  SETTINGS_PATH,
} from 'constants/routes';
import { createMeeting } from 'helpers/privateMeeting';

import menu from 'assets/menu.svg';
import lucaLogo from 'assets/LucaLogoWhite.svg';

import { CheckinIcon, HistoryIcon } from 'components/Icons';
import { AppContent, AppHeadline, AppLayout } from 'components/AppLayout';

import {
  StyledFooterContainer,
  StyledFooterItem,
  StyledHeaderMenuIconContainer,
  StyledLucaLogo,
  StyledMenuIcon,
  StyledPrivateMeetingButton,
  StyledQRCodeInfo,
  StyledQRCodeInfoContainer,
  StyledQRCodeWrapper,
  StyledSecondaryButton,
} from './Home.styled';
import { SelfCheckin } from './SelfCheckin';
import { WebAppWarningModal } from './WebAppWarningModal';
import { HostPrivateMeetingWarningModal } from './HostPrivateMeetingWarningModal';

import { useTraceQRCode } from './useTraceQRCode';
import { useCheckInCheck } from './useCheckInCheck';
import { PrivateMeetingWarningModal } from './PrivateMeetingWarningModal';

export function Home({ match: { params: parameters }, location: { hash } }) {
  const intl = useIntl();
  const history = useHistory();
  const [showSelfCheckin, setShowSelfCheckin] = useState(false);
  const [showWebAppWarningModal, setShowWebAppWarningModal] = useState(false);
  const [
    showPrivateMeetingWarningModal,
    setShowPrivateMeetingWarningModal,
  ] = useState(false);
  const [
    showPrivateMeetingCheckInWarningModal,
    setShowPrivateMeetingCheckInWarningModal,
  ] = useState(false);

  const [users, setUsers] = useState();
  const qrCode = useTraceQRCode(users);
  const {
    checkinToPrivateMeeting,
    cancelCheckinToPrivateMeeting,
  } = useCheckInCheck({
    users,
    hash,
    parameters,
    setShowWebAppWarningModal,
    setShowPrivateMeetingCheckInWarningModal,
  });

  useEffect(() => {
    indexDB.users
      .toArray()
      .then(result => setUsers(result))
      .catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'Home.PageTitle' })}</title>
      </Helmet>
      <AppLayout
        header={
          showSelfCheckin ? (
            <AppHeadline>
              {intl.formatMessage({ id: 'Home.Scanner.Headline' })}
            </AppHeadline>
          ) : (
            <>
              <StyledLucaLogo alt="luca" src={lucaLogo} />
              <StyledHeaderMenuIconContainer
                tabIndex="4"
                id="settings"
                onClick={() => history.push(SETTINGS_PATH)}
                aria-label={intl.formatMessage({
                  id: 'Home.AriaSettingsLabel',
                })}
              >
                <StyledMenuIcon src={menu} alt="settings" />
              </StyledHeaderMenuIconContainer>
            </>
          )
        }
        footer={
          <>
            <StyledFooterContainer id="home">
              <StyledFooterItem
                tabIndex="2"
                isActive
                aria-label={intl.formatMessage({
                  id: 'Home.AriaLabel',
                })}
              >
                <CheckinIcon color="rgb(195, 206, 217)" />
                {intl.formatMessage({ id: 'Home.MenuItem' })}
              </StyledFooterItem>
            </StyledFooterContainer>
            <StyledFooterContainer
              id="history"
              aria-label={intl.formatMessage({
                id: 'History.AriaLabel',
              })}
            >
              <StyledFooterItem
                tabIndex="3"
                onClick={() => history.push(HISTORY_PATH)}
              >
                <HistoryIcon />
                {intl.formatMessage({ id: 'History.MenuItem' })}
              </StyledFooterItem>
            </StyledFooterContainer>
          </>
        }
      >
        {showSelfCheckin ? (
          <SelfCheckin onClose={() => setShowSelfCheckin(false)} />
        ) : (
          <>
            <AppContent>
              <StyledQRCodeInfoContainer data-cy="QRCodeInfo">
                <StyledQRCodeInfo>
                  {intl.formatMessage({ id: 'Home.QRCodeInfo' })}
                </StyledQRCodeInfo>
              </StyledQRCodeInfoContainer>
              <StyledQRCodeWrapper>
                <QRCode size={200} value={qrCode} />
              </StyledQRCodeWrapper>
            </AppContent>
            <AppContent flex="unset">
              <StyledSecondaryButton
                id="selfCheckin"
                tabIndex="5"
                onClick={() => setShowSelfCheckin(true)}
              >
                {intl.formatMessage({ id: 'Home.CheckIn' })}
              </StyledSecondaryButton>
              <StyledPrivateMeetingButton
                tabIndex="6"
                id="privateMeeting"
                onClick={() => setShowPrivateMeetingWarningModal(true)}
              >
                {intl.formatMessage({ id: 'Home.PrivateMeeting' })}
              </StyledPrivateMeetingButton>
            </AppContent>
          </>
        )}
      </AppLayout>
      {showWebAppWarningModal && (
        <WebAppWarningModal onClose={() => setShowWebAppWarningModal(false)} />
      )}
      {showPrivateMeetingWarningModal && (
        <HostPrivateMeetingWarningModal
          onCheck={() => {
            createMeeting()
              .then(() => {
                history.push(BASE_PRIVATE_MEETING_PATH);
              })
              .catch(error => console.error(error));
            setShowPrivateMeetingWarningModal(false);
          }}
          onCancel={() => setShowPrivateMeetingWarningModal(false)}
        />
      )}
      {showPrivateMeetingCheckInWarningModal && (
        <PrivateMeetingWarningModal
          onCheck={checkinToPrivateMeeting}
          onCancel={cancelCheckinToPrivateMeeting}
        />
      )}
    </>
  );
}
