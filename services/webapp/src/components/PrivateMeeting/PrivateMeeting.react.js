import React, { useState } from 'react';

import QRCode from 'qrcode.react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';

import { HOME_PATH } from 'constants/routes';
import { stopMeeting } from 'helpers/privateMeeting';

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

import { useCheckActivePrivateMeeting } from './useCheckActivePrivateMeeting';

function PrivateMeetingComponent() {
  const history = useHistory();
  const intl = useIntl();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const {
    activeQRCode,
    numberOfGuests,
    activeMeeting,
    numberOfActiveGuests,
  } = useCheckActivePrivateMeeting();

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'PrivateMeeting.PageTitle' })}</title>
      </Helmet>
      <AppLayout
        header={
          <AppHeadline color="#000">
            {intl.formatMessage({ id: 'PrivateMeeting.Headline' })}
          </AppHeadline>
        }
        bgColor="#b8c0ca"
      >
        <StyledHeader flex="unset">
          <StyledInfoText>
            {intl.formatMessage({ id: 'PrivateMeeting.Description' })}
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
            {intl.formatMessage({ id: 'PrivateMeeting.Close' })}
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
