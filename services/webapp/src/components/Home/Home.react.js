import React, { useEffect, useMemo, useState } from 'react';

import QRCode from 'qrcode.react';
import { notification } from 'antd';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import useInterval from '@use-it/interval';
import { decodeUtf8 } from '@lucaapp/crypto';
import { useHistory } from 'react-router-dom';

import { indexDB } from 'db';
import { checkin, generateQRCode } from 'helpers/crypto';
import {
  HISTORY_PATH,
  SETTINGS_PATH,
  BASE_PRIVATE_MEETING_PATH,
} from 'constants/routes';
import { getCheckOutPath } from 'helpers/routes';
import { isLocalTimeCorrect } from 'helpers/time';
import { createMeeting } from 'helpers/privateMeeting';
import { base64UrlToBytes } from 'utils/encodings';

import menu from 'assets/menu.svg';
import lucaLogo from 'assets/LucaLogoWhite.svg';

import { WEBAPP_WARNING_MODAL_SHOWN_SESSION_KEY } from 'constants/storage';

import { CheckinIcon, HistoryIcon } from 'components/Icons';
import { AppContent, AppHeadline, AppLayout } from 'components/AppLayout';

import {
  StyledLucaLogo,
  StyledMenuIcon,
  StyledQRCodeInfo,
  StyledFooterItem,
  StyledQRCodeWrapper,
  StyledSecondaryButton,
  StyledQRCodeInfoContainer,
  StyledPrivateMeetingButton,
  StyledHeaderMenuIconContainer,
  StyledFooterContainer,
} from './Home.styled';
import { SelfCheckin } from './SelfCheckin';
import { WebAppWarningModal } from './WebAppWarningModal';
import { HostPrivateMeetingWarningModal } from './HostPrivateMeetingWarningModal';

export function Home({ match: { params: parameters }, location: { hash } }) {
  const intl = useIntl();
  const history = useHistory();
  const [showSelfCheckin, setShowSelfCheckin] = useState(false);
  const [showWebAppWarningModal, setShowWebAppWarningModal] = useState(false);
  const [
    showPrivateMeetingWarningModal,
    setShowPrivateMeetingWarningModal,
  ] = useState(false);
  const [qrCode, setQRCode] = useState('');

  useEffect(() => {
    isLocalTimeCorrect()
      .then(isTimeCorrect => {
        if (isTimeCorrect) return;
        notification.error({
          message: intl.formatMessage({
            id: 'error.systemTime',
          }),
        });
      })
      .catch(console.error);
  }, [intl]);

  const generateTraceQRCode = useMemo(() => {
    return async () => {
      try {
        const users = await indexDB.users.toArray();
        if (users && users[0]?.userId) {
          const [{ userId }] = users;
          setQRCode(await generateQRCode(userId));
        }
      } catch (error) {
        const descriptionId =
          error.descriptionId ?? 'QRCodeGenerator.error.unknown';
        notification.error({
          message: intl.formatMessage({
            id: 'QRCodeGenerator.error.headline',
          }),
          description: intl.formatMessage({
            id: descriptionId,
          }),
        });
      }
    };
  }, [intl]);

  useInterval(generateTraceQRCode, 60000);

  useEffect(() => {
    if (parameters.scannerId) {
      let decodedData;
      try {
        decodedData = JSON.parse(
          decodeUtf8(base64UrlToBytes((hash || '').replace('#', '')))
        );
      } catch {
        decodedData = null;
      }

      checkin(parameters.scannerId, decodedData)
        .then(traceId => {
          history.push(getCheckOutPath(traceId));
        })
        .catch(() => {
          notification.error({
            message: intl.formatMessage({
              id: 'error.headline',
            }),
            description: intl.formatMessage({
              id: 'error.description',
            }),
          });
        });
    } else {
      indexDB.users
        .toArray()
        .then(([user]) => {
          if (
            !user.useWebApp &&
            sessionStorage.getItem(WEBAPP_WARNING_MODAL_SHOWN_SESSION_KEY) !==
              'true'
          ) {
            setShowWebAppWarningModal(true);
            sessionStorage.setItem(
              WEBAPP_WARNING_MODAL_SHOWN_SESSION_KEY,
              'true'
            );
          }
        })
        .catch(() => {});
    }
  }, [intl, hash, history, parameters]);

  useEffect(() => {
    generateTraceQRCode();
  }, [generateTraceQRCode]);

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
            <StyledFooterContainer>
              <StyledFooterItem isActive>
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
    </>
  );
}
