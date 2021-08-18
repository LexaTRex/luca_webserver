import React, { useCallback, useEffect, useState } from 'react';

import moment from 'moment';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { Steps, notification } from 'antd';
import { useHistory } from 'react-router-dom';

import { indexDB } from 'db';
import { getLocation } from 'helpers/locations';
import { reportInfection } from 'helpers/crypto';
import { HOME_PATH } from 'constants/routes';

import { InfoIcon } from 'components/InfoIcon/InfoIcon.react';

import { CheckinIcon, HistoryIcon } from 'components/Icons';

import { AppLayout, AppHeadline, AppContent } from 'components/AppLayout';

import {
  StyledSteps,
  StyledFooter,
  StyledFooterItem,
  StyledHistoryTitle,
  StyledHistoryContent,
  StyledFooterContainer,
  StyledSecondaryButton,
  StyledHistoryInfoTitle,
  StyledHistoryInfoContainer,
  StyledHistoryStepContainer,
} from './History.styled';
import { HistoryShareModal } from './HistoryShareModal';
import { HistoryShareConsentModal } from './HistoryShareConsentModal';
import { HistoryPrivateMeetingInfoModal } from './HistoryPrivateMeetingInfoModal';

const { Step } = Steps;

const CHECKIN_TYPE = 'CHECK_IN';
const PRIVATE_MEETING_HOST_TYPE = 'PRIVATE_MEETING_HOST';
const PRIVATE_MEETING_CHECK_IN_TYPE = 'PRIVATE_MEETING_CHECK_IN';

const SHARE_CONSENT_MODAL_STEP = 0;
const SHARE_TAN_MODAL_STEP = 1;

export function History() {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [user, setUser] = useState([]);
  const [userHistory, setUserHistory] = useState([]);
  const [locations, setLocation] = useState({});
  const [shareTAN, setShareTAN] = useState(null);
  const [privateMeetings, setPrivateMeetings] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activePrivateMeeting, setActivePrivateMeeting] = useState(null);
  const [currentHistoryShareStep, setCurrentHistoryShareStep] = useState(
    SHARE_CONSENT_MODAL_STEP
  );

  const closeModal = () => {
    setShowShareModal(false);
    setCurrentHistoryShareStep(0);
  };

  const showShareTAN = () => setCurrentHistoryShareStep(SHARE_TAN_MODAL_STEP);
  const historyShareSteps = [
    <HistoryShareConsentModal
      next={showShareTAN}
      key="share-consent"
      onClose={closeModal}
    />,
    <HistoryShareModal key="share-tan" tan={shareTAN} onClose={closeModal} />,
  ];

  const internalIndexedDBError = useCallback(() => {
    notification.error({
      message: formatMessage({
        id: 'IndexedDB.error.transaction',
      }),
    });
  }, [formatMessage]);

  useEffect(() => {
    indexDB.users
      .toArray()
      .then(users => setUser(users[0]))
      .catch(() => internalIndexedDBError());
    indexDB.history
      .toCollection()
      .toArray()
      .then(databaseHistory =>
        setUserHistory(
          databaseHistory.map(entry => ({
            type: CHECKIN_TYPE,
            ...entry,
          }))
        )
      )
      .catch(() => internalIndexedDBError());
    indexDB.privateLocations
      .toCollection()
      .toArray()
      .then(databasePrivateMeetings =>
        setPrivateMeetings(
          databasePrivateMeetings.map(privateMeeting => ({
            ...privateMeeting,
            type: PRIVATE_MEETING_HOST_TYPE,
            checkout: privateMeeting.endedAt,
            checkin: privateMeeting.startedAt,
          }))
        )
      )
      .catch(() => internalIndexedDBError());
  }, [internalIndexedDBError]);

  useEffect(() => {
    Promise.all(
      userHistory.map(historyEntry =>
        getLocation(historyEntry.locationId).catch(() => {})
      )
    )
      .then(databaseLocations => {
        const locationMap = {};

        for (const location of databaseLocations) {
          locationMap[location.locationId] = location;
        }

        setLocation(locationMap);
      })
      .catch(() => internalIndexedDBError());
  }, [userHistory, internalIndexedDBError]);

  const shareHistory = useCallback(() => {
    reportInfection()
      .then(tan => {
        setShareTAN(tan);
        setShowShareModal(true);
      })
      .catch(() => {
        setShareTAN(null);
        setShowShareModal(false);
      });
  }, [setShareTAN, setShowShareModal]);

  return (
    <>
      <Helmet>
        <title>{formatMessage({ id: 'History.PageTitle' })}</title>
      </Helmet>
      <AppLayout
        header={
          <AppHeadline>{formatMessage({ id: 'History.Headline' })}</AppHeadline>
        }
        footer={
          <>
            <StyledFooterContainer>
              <StyledFooterItem
                id="home"
                tabIndex="2"
                onClick={() => history.push(HOME_PATH)}
                aria-label={formatMessage({
                  id: 'Home.AriaLabel',
                })}
              >
                <CheckinIcon />
                {formatMessage({ id: 'Home.MenuItem' })}
              </StyledFooterItem>
            </StyledFooterContainer>
            <StyledFooterContainer>
              <StyledFooterItem
                isActive
                id="history"
                tabIndex="3"
                aria-label={formatMessage({
                  id: 'History.AriaLabel',
                })}
              >
                <HistoryIcon color="rgb(195, 206, 217)" />
                {formatMessage({ id: 'History.MenuItem' })}
              </StyledFooterItem>
            </StyledFooterContainer>
          </>
        }
      >
        <AppContent noCentering>
          <StyledSteps
            progressDot
            direction="vertical"
            current={[...userHistory, ...privateMeetings].length}
          >
            {[...userHistory, ...privateMeetings]
              .sort((historyEntry1, historyEntry2) =>
                historyEntry1.checkin < historyEntry2.checkin ? 1 : -1
              )
              .map(historyEntry => {
                let title = '';
                let entryType = historyEntry.type;
                switch (historyEntry.type) {
                  case CHECKIN_TYPE: {
                    if (locations[historyEntry.locationId]?.isPrivate) {
                      entryType = PRIVATE_MEETING_CHECK_IN_TYPE;
                    }

                    title = locations[historyEntry.locationId]?.name;
                    break;
                  }
                  case PRIVATE_MEETING_HOST_TYPE: {
                    title = `${user.firstName} ${user.lastName}`;
                    break;
                  }
                  default: {
                    title = '';
                  }
                }

                return (
                  <Step
                    key={historyEntry.traceId}
                    title={
                      <StyledHistoryStepContainer>
                        <StyledHistoryInfoContainer>
                          {(entryType === PRIVATE_MEETING_HOST_TYPE ||
                            entryType === PRIVATE_MEETING_CHECK_IN_TYPE) && (
                            <StyledHistoryInfoTitle>
                              {formatMessage({
                                id: 'History.Timeline.PrivateMeeting',
                              })}
                            </StyledHistoryInfoTitle>
                          )}
                          {historyEntry.type === PRIVATE_MEETING_HOST_TYPE && (
                            <InfoIcon
                              inverted
                              id={`PrivateMeeting${title.replaceAll(
                                ' ',
                                '_'
                              )}Info`}
                              onClick={() =>
                                setActivePrivateMeeting(historyEntry.locationId)
                              }
                            />
                          )}
                        </StyledHistoryInfoContainer>
                        <StyledHistoryTitle>{title}</StyledHistoryTitle>
                      </StyledHistoryStepContainer>
                    }
                    description={
                      <StyledHistoryContent>
                        {historyEntry.checkin &&
                          moment
                            .unix(historyEntry.checkin)
                            .format('DD.MM.YYYY HH.mm')}
                        {' - '}
                        {historyEntry.checkout &&
                          moment
                            .unix(historyEntry.checkout)
                            .format('HH.mm')}{' '}
                        {formatMessage({ id: 'Checkout.Clock' })}
                      </StyledHistoryContent>
                    }
                  />
                );
              })}
          </StyledSteps>
        </AppContent>
        <StyledFooter flex="unset">
          <StyledSecondaryButton tabIndex="4" onClick={shareHistory}>
            {formatMessage({ id: 'History.ShareHistory' })}
          </StyledSecondaryButton>
        </StyledFooter>
      </AppLayout>
      {showShareModal && shareTAN && historyShareSteps[currentHistoryShareStep]}
      {activePrivateMeeting && (
        <HistoryPrivateMeetingInfoModal
          locationId={activePrivateMeeting}
          onClose={() => setActivePrivateMeeting(null)}
        />
      )}
    </>
  );
}
