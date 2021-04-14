import moment from 'moment';
import { useIntl } from 'react-intl';
import { Steps, notification } from 'antd';
import { useHistory } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';

import { indexDB } from 'db';
import { HOME_PATH } from 'constants/routes';
import { reportInfection } from 'helpers/crypto';
import { getLocation } from 'helpers/locations';

import { HistoryIcon, MenuIcon } from '../Icons';
import { InfoIcon } from '../InfoIcon/InfoIcon.react';
import { AppLayout, AppHeadline, AppContent } from '../AppLayout';

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
import { HistoryShareModal } from './HistoryShareModal/HistoryShareModal.react';
import { HistoryPrivateMeetingInfoModal } from './HistoryPrivateMeetingInfoModal/HistoryPrivateMeetingInfoModal.react';

const { Step } = Steps;

const CHECKIN_TYPE = 'CHECK_IN';
const PRIVATE_MEETING_HOST_TYPE = 'PRIVATE_MEETING_HOST';
const PRIVATE_MEETING_CHECK_IN_TYPE = 'PRIVATE_MEETING_CHECK_IN';

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
      <AppLayout
        header={
          <AppHeadline>{formatMessage({ id: 'History.Headline' })}</AppHeadline>
        }
        footer={
          <>
            <StyledFooterContainer>
              <StyledFooterItem onClick={() => history.push(HOME_PATH)}>
                <MenuIcon color="rgb(195, 206, 217)" />
                {formatMessage({ id: 'Home.MenuItem' })}
              </StyledFooterItem>
            </StyledFooterContainer>
            <StyledFooterContainer>
              <StyledFooterItem isActive>
                <HistoryIcon />
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
          <StyledSecondaryButton onClick={shareHistory}>
            {formatMessage({ id: 'History.ShareHistory' })}
          </StyledSecondaryButton>
        </StyledFooter>
      </AppLayout>
      {showShareModal && shareTAN && (
        <HistoryShareModal
          tan={shareTAN}
          onClose={() => setShowShareModal(false)}
        />
      )}
      {activePrivateMeeting && (
        <HistoryPrivateMeetingInfoModal
          locationId={activePrivateMeeting}
          onClose={() => setActivePrivateMeeting(null)}
        />
      )}
    </>
  );
}
