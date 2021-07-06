import { useEffect, useMemo, useState } from 'react';

import { notification } from 'antd';
import { useIntl } from 'react-intl';
import useInterval from '@use-it/interval';
import { useHistory } from 'react-router-dom';

import { indexDB } from 'db';
import {
  syncMeeting,
  generateMeetingQRCode,
  checkForActiveHostedPrivateMeeting,
} from 'helpers/privateMeeting';
import { HOME_PATH } from 'constants/routes';

export function useCheckActivePrivateMeeting() {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [activeQRCode, setActiveQRCode] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(0);
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [numberOfActiveGuests, setNumberOfActiveGuests] = useState(0);

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
    checkForActiveHostedPrivateMeeting()
      .then(meeting => {
        setActiveMeeting(meeting);
      })
      .catch(() => {
        history.push(HOME_PATH);
      });
  }, [history]);

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

  return { activeQRCode, numberOfGuests, activeMeeting, numberOfActiveGuests };
}
