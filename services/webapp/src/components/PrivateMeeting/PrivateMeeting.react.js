import React, { useEffect, useState, useCallback, useMemo } from 'react';

import QRCode from 'qrcode.react';
import { notification } from 'antd';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import useInterval from '@use-it/interval';
import { useHistory } from 'react-router-dom';

import { indexDB } from 'db';
import { HOME_PATH } from 'constants/routes';
import {
  syncMeeting,
  stopMeeting,
  generateMeetingQRCode,
  checkinToPrivateMeeting,
  checkForActiveHostedPrivateMeeting,
} from 'helpers/privateMeeting';
import { getCheckOutPath } from 'helpers/routes';

import { InfoIcon } from 'components/InfoIcon/InfoIcon.react';
import { AppContent, AppHeadline, AppLayout } from 'components/AppLayout';

import {
  StyledHeader,
  StyledFooter,
  StyledInfoText,
  StyledCloseButton,
  StyledQRCodeWrapper,
} from './PrivateMeeting.styled';
import { PrivateMeetingInfo } from './PrivateMeetingInfo/PrivateMeetingInfo.react';
import { PrivateMeetingInfoModal } from './PrivateMeetingInfoModal/PrivateMeetingInfoModal.react';
import { PrivateMeetingPeopleModal } from './PrivateMeetingPeopleModal/PrivateMeetingPeopleModal.react';
import { PrivateMeetingCheckoutWarningModal } from './PrivateMeetingCheckoutWarningModal/PrivateMeetingCheckoutWarningModal.react';

function PrivateMeetingComponent({
  match: { params: parameters },
  location: { hash },
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [activeQRCode, setActiveQRCode] = useState('');
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [numberOfGuests, setNumberOfGuests] = useState(0);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [numberOfActiveGuests, setNumberOfActiveGuests] = useState(0);

  const checkin = useCallback(
    scannerId =>
      checkinToPrivateMeeting(scannerId, (hash || '').replace('#', ''))
        .then(traceId => {
          history.push(getCheckOutPath(traceId));
        })
        .catch(() => {
          history.push(HOME_PATH);
        }),
    [hash, history]
  );

  const checkForActiveMeeting = useMemo(() => {
    return async () => {
      try {
        if (activeMeeting) {
          await syncMeeting(activeMeeting);
          setNumberOfGuests(
            await indexDB.guests
              .where({ locationId: activeMeeting.locationId || '' })
              .count()
          );
          setNumberOfActiveGuests(
            await indexDB.guests
              .where({
                locationId: activeMeeting.locationId || '',
                checkout: -1,
              })
              .count()
          );
        }
      } catch {
        notification.error({
          message: formatMessage({
            id: 'error.headline',
          }),
          description: formatMessage({
            id: 'error.description',
          }),
        });
      }
    };
  }, [activeMeeting, formatMessage]);

  useEffect(() => {
    if (parameters.scannerId) {
      indexDB.users
        .count()
        .then(numberOfUsers => {
          if (numberOfUsers > 0) {
            checkin(parameters.scannerId);
          }
        })
        .catch(() => {
          history.push(HOME_PATH);
        });
      return;
    }

    checkForActiveHostedPrivateMeeting()
      .then(meeting => {
        setActiveMeeting(meeting);
      })
      .catch(() => {
        history.push(HOME_PATH);
      });
  }, [parameters, history, hash, checkin]);

  useEffect(() => {
    if (activeMeeting) {
      generateMeetingQRCode(activeMeeting)
        .then(data => setActiveQRCode(data))
        .catch(() => history.push(HOME_PATH));
    }
  }, [history, activeMeeting]);

  useEffect(() => {
    checkForActiveMeeting();
  }, [checkForActiveMeeting]);
  useInterval(checkForActiveMeeting, 5000);

  if (parameters.scannerId) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{formatMessage({ id: 'PrivateMeeting.PageTitle' })}</title>
      </Helmet>
      <AppLayout
        header={
          <AppHeadline color="#000">
            {formatMessage({ id: 'PrivateMeeting.Headline' })}
          </AppHeadline>
        }
        bgColor="#b8c0ca"
      >
        <StyledHeader flex="unset">
          <StyledInfoText>
            {formatMessage({ id: 'PrivateMeeting.Description' })}
          </StyledInfoText>
          <InfoIcon onClick={() => setIsInfoModalOpen(true)} />
        </StyledHeader>
        <AppContent>
          <StyledQRCodeWrapper>
            <QRCode size={200} value={activeQRCode} />
          </StyledQRCodeWrapper>
        </AppContent>
        <PrivateMeetingInfo
          numberOfGuests={numberOfGuests}
          startedAt={activeMeeting?.startedAt}
          numberOfActiveGuests={numberOfActiveGuests}
          onPeopleInfoClick={() => setIsPeopleModalOpen(true)}
        />
        <StyledFooter flex="unset">
          <StyledCloseButton onClick={() => setShowCheckoutModal(true)}>
            {formatMessage({ id: 'PrivateMeeting.Close' })}
          </StyledCloseButton>
        </StyledFooter>
        {isInfoModalOpen && (
          <PrivateMeetingInfoModal onClose={() => setIsInfoModalOpen(false)} />
        )}
        {isPeopleModalOpen && (
          <PrivateMeetingPeopleModal
            locationId={activeMeeting.locationId}
            onClose={() => setIsPeopleModalOpen(false)}
          />
        )}
      </AppLayout>
      {showCheckoutModal && (
        <PrivateMeetingCheckoutWarningModal
          onSumit={() => {
            stopMeeting(activeMeeting)
              .then(() => history.push(HOME_PATH))
              .catch(() => history.push(HOME_PATH));
            setShowCheckoutModal(false);
          }}
          onCancel={() => setShowCheckoutModal(false)}
        />
      )}
    </>
  );
}
export const PrivateMeeting = React.memo(PrivateMeetingComponent);
