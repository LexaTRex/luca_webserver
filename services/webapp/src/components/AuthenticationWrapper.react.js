import { useCallback, useEffect, useMemo, useState } from 'react';

import { notification } from 'antd';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import useInterval from '@use-it/interval';
import { useHistory } from 'react-router-dom';
import { getLocation } from 'connected-react-router';

import { indexDB } from 'db';
import {
  HOME_PATH,
  CHECK_OUT_PATH,
  ON_BOARDING_PATH,
  COVID_TEST_PATH,
  APPOINTMENT_PATH,
  BASE_PRIVATE_MEETING_PATH,
} from 'constants/routes';
import {
  syncHistory,
  checkHistory,
  checkSession,
  checkLocalHistory,
} from 'helpers/history';
import { getCheckOutPath } from 'helpers/routes';
import { checkForActiveHostedPrivateMeeting } from 'helpers/privateMeeting';

export function AuthenticationWrapper({ children }) {
  const intl = useIntl();
  const history = useHistory();
  const location = useSelector(getLocation);
  const [isHostingMeeting, setIsHostingMeeting] = useState(false);

  const checkLocation = useCallback(
    appLocation => {
      (async () => {
        if ((await indexDB.users.count()) === 0) {
          if (
            !appLocation.pathname.includes(ON_BOARDING_PATH) &&
            !appLocation.pathname.includes(APPOINTMENT_PATH) &&
            !appLocation.pathname.includes(COVID_TEST_PATH)
          ) {
            if (appLocation.pathname.includes(HOME_PATH)) {
              const splits = appLocation.pathname.split('/');

              if (splits[splits.length - 1]) {
                history.push(
                  `${ON_BOARDING_PATH}/${
                    splits[splits.length - 1]
                  }?isPrivateMeeting=${appLocation.pathname.includes(
                    BASE_PRIVATE_MEETING_PATH
                  )}${appLocation.hash}`
                );
                return;
              }
            }

            history.push(ON_BOARDING_PATH);
          }
          return;
        }

        if (appLocation.pathname.includes(ON_BOARDING_PATH)) {
          history.push(HOME_PATH);
        }

        try {
          const activeMeeting = await checkForActiveHostedPrivateMeeting();
          if (activeMeeting) {
            setIsHostingMeeting(true);
            if (!appLocation.pathname.includes(BASE_PRIVATE_MEETING_PATH)) {
              history.push(BASE_PRIVATE_MEETING_PATH);
            }

            return;
          }
        } catch (error) {
          console.error(error);
        }

        setIsHostingMeeting(false);

        const openSession = await checkLocalHistory();
        if (openSession && !location.pathname.includes(CHECK_OUT_PATH)) {
          history.push(getCheckOutPath(openSession.traceId));
          return;
        }

        let isCheckedIn = false;
        const sessions = await checkHistory();
        const historySync = [];
        for (const session of sessions) {
          historySync.push(syncHistory(session));

          if (
            !isCheckedIn &&
            !session.checkout &&
            !location.pathname.includes(CHECK_OUT_PATH)
          ) {
            isCheckedIn = true;
            history.push(getCheckOutPath(session.traceId));
          }
        }
        await Promise.all(historySync);
      })().catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'error.headline',
          }),
          description: intl.formatMessage({
            id: 'error.description',
          }),
        });
      });
    },
    [history, intl, location.pathname]
  );

  const checkTraces = useMemo(() => {
    return async () => {
      if (isHostingMeeting) {
        return;
      }

      const searchParameters = new URLSearchParams(location.search);
      const traceId = searchParameters.get('traceId');

      try {
        if (traceId && location.pathname.includes(CHECK_OUT_PATH)) {
          const historyEntry = await checkSession(traceId);
          if (historyEntry.checkout) {
            history.push(HOME_PATH);
          }
          return;
        }
      } catch {
        notification.error({
          message: intl.formatMessage({
            id: 'error.headline',
          }),
          description: intl.formatMessage({
            id: 'error.description',
          }),
        });
      }

      const sessions = await checkHistory(10);
      if (!sessions) return;

      for (const session of sessions) {
        if (!session.checkout && !location.pathname.includes(CHECK_OUT_PATH)) {
          history.push(getCheckOutPath(session.traceId));
          return;
        }
      }
    };
  }, [history, intl, isHostingMeeting, location.pathname, location.search]);

  useInterval(checkTraces, 800);

  useEffect(() => {
    checkTraces();
  }, [checkTraces]);

  useEffect(() => {
    checkLocation(location);
  }, [checkLocation, location]);

  return children;
}
