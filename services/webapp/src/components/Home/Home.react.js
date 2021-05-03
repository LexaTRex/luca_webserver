import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode.react';

import { notification } from 'antd';
import { useIntl } from 'react-intl';
import useInterval from '@use-it/interval';
import { decodeUtf8 } from '@lucaapp/crypto';
import { useHistory } from 'react-router-dom';

import { indexDB } from 'db';
import {
  checkin,
  generateQRCode,
  InvalidDailyKeySignature,
} from 'helpers/crypto';
import {
  HISTORY_PATH,
  SETTINGS_PATH,
  SELF_CHECKIN_PATH,
  BASE_PRIVATE_MEETING_PATH,
} from 'constants/routes';
import { getCheckOutPath } from 'helpers/routes';
import { isLocalTimeCorrect } from 'helpers/time';
import { createMeeting } from 'helpers/privateMeeting';
import { base64UrlToBytes } from 'utils/encodings';

import menu from 'assets/menu.svg';
import lucaLogo from 'assets/LucaLogoWhite.svg';

import { AppContent, AppLayout } from '../AppLayout';
import {
  StyledLucaLogo,
  StyledMenuIcon,
  StyledQRCodeInfo,
  StyledFooterItem,
  StyledQRCodeCounter,
  StyledQRCodeWrapper,
  StyledSecondaryButton,
  StyledQRCodeInfoContainer,
  StyledPrivateMeetingButton,
  StyledHeaderMenuIconContainer,
  StyledFooterContainer,
} from './Home.styled';

import { HistoryIcon, MenuIcon } from '../Icons';
import { HostPrivateMeetingWarningModal } from './HostPrivateMeetingWarningModal';

export function Home({ match: { params: parameters }, location: { hash } }) {
  const intl = useIntl();
  const history = useHistory();
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
        notification.error({
          message: intl.formatMessage({ id: 'QRCodeGenerator.error.headline' }),
          description: intl.formatMessage({
            id:
              error instanceof InvalidDailyKeySignature
                ? 'QRCodeGenerator.error.invalidSignature'
                : 'QRCodeGenerator.error.unknown',
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
    }
  }, [intl, hash, history, parameters]);

  useEffect(() => {
    generateTraceQRCode();
  }, [generateTraceQRCode]);

  return (
    <>
      <AppLayout
        header={
          <>
            <StyledLucaLogo src={lucaLogo} />
            <StyledHeaderMenuIconContainer>
              <StyledMenuIcon
                src={menu}
                onClick={() => history.push(SETTINGS_PATH)}
              />
            </StyledHeaderMenuIconContainer>
          </>
        }
        footer={
          <>
            <StyledFooterContainer>
              <StyledFooterItem isActive>
                <MenuIcon />
                {intl.formatMessage({ id: 'Home.MenuItem' })}
              </StyledFooterItem>
            </StyledFooterContainer>
            <StyledFooterContainer>
              <StyledFooterItem onClick={() => history.push(HISTORY_PATH)}>
                <HistoryIcon color="rgb(195, 206, 217)" />
                {intl.formatMessage({ id: 'History.MenuItem' })}
              </StyledFooterItem>
            </StyledFooterContainer>
          </>
        }
      >
        <AppContent>
          <StyledQRCodeInfoContainer data-cy="QRCodeInfo">
            <StyledQRCodeInfo>
              {intl.formatMessage({ id: 'Home.QRCodeInfo' })}
            </StyledQRCodeInfo>
            <StyledQRCodeCounter />
          </StyledQRCodeInfoContainer>
          <StyledQRCodeWrapper>
            <QRCode size={200} value={qrCode} />
          </StyledQRCodeWrapper>
        </AppContent>
        <AppContent flex="unset">
          <StyledSecondaryButton
            onClick={() => history.push(SELF_CHECKIN_PATH)}
          >
            {intl.formatMessage({ id: 'Home.CheckIn' })}
          </StyledSecondaryButton>
          <StyledPrivateMeetingButton
            onClick={() => setShowPrivateMeetingWarningModal(true)}
          >
            {intl.formatMessage({ id: 'Home.PrivateMeeting' })}
          </StyledPrivateMeetingButton>
        </AppContent>
      </AppLayout>
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
