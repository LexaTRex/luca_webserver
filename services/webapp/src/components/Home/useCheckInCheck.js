import { useEffect } from 'react';
import { notification } from 'antd';
import { useIntl } from 'react-intl';
import { base64UrlToBytes, decodeUtf8 } from '@lucaapp/crypto';
import { useHistory } from 'react-router-dom';

import { getScanner } from 'network/api';

import { HOME_PATH } from 'constants/routes';
import { WEBAPP_WARNING_MODAL_SHOWN_SESSION_KEY } from 'constants/storage';

import { checkin } from 'helpers/crypto';
import { getLocation } from 'helpers/locations';
import { getCheckOutPath } from 'helpers/routes';
import { checkinToPrivateMeeting } from 'helpers/privateMeeting';

function getDecodedData(hash) {
  let decodedData;
  try {
    decodedData = JSON.parse(
      decodeUtf8(base64UrlToBytes((hash || '').replace('#', '')))
    );
  } catch {
    decodedData = null;
  }

  return decodedData;
}

async function checkinToLocationOrPrivateMeeting({
  intl,
  history,
  scannerId,
  decodedData,
  setShowPrivateMeetingCheckInWarningModal,
}) {
  try {
    const scanner = await getScanner(scannerId);
    const location = await getLocation(scanner.locationId);

    if (location.isPrivate) {
      setShowPrivateMeetingCheckInWarningModal(true);
      return;
    }

    const traceId = await checkin(scannerId, decodedData);
    history.push(getCheckOutPath(traceId));
  } catch {
    history.replace(HOME_PATH);
    notification.error({
      message: intl.formatMessage({
        id: 'error.headline',
      }),
      description: intl.formatMessage({
        id: 'error.description',
      }),
    });
  }
}

export function useCheckInCheck({
  hash,
  users,
  parameters,
  setShowWebAppWarningModal,
  setShowPrivateMeetingCheckInWarningModal,
}) {
  const intl = useIntl();
  const history = useHistory();

  useEffect(() => {
    if (parameters.scannerId && users?.[0]?.userId) {
      checkinToLocationOrPrivateMeeting({
        intl,
        history,
        scannerId: parameters.scannerId,
        decodedData: getDecodedData(hash),
        setShowPrivateMeetingCheckInWarningModal,
      });
    } else if (
      users?.[0]?.useWebApp === false &&
      sessionStorage.getItem(WEBAPP_WARNING_MODAL_SHOWN_SESSION_KEY) !== 'true'
    ) {
      setShowWebAppWarningModal(true);
      sessionStorage.setItem(WEBAPP_WARNING_MODAL_SHOWN_SESSION_KEY, 'true');
    }
  }, [
    intl,
    hash,
    users,
    history,
    parameters,
    setShowWebAppWarningModal,
    setShowPrivateMeetingCheckInWarningModal,
  ]);

  const checkinToPrivateMeetingCallback = async () => {
    try {
      const traceId = await checkinToPrivateMeeting(
        parameters.scannerId,
        hash.replace('#', '')
      );
      history.push(getCheckOutPath(traceId));
    } catch {
      setShowPrivateMeetingCheckInWarningModal(false);
      history.replace(HOME_PATH);
      notification.error({
        message: intl.formatMessage({
          id: 'error.headline',
        }),
        description: intl.formatMessage({
          id: 'error.description',
        }),
      });
    }
  };
  const cancelCheckinToPrivateMeetingCallback = () => {
    setShowPrivateMeetingCheckInWarningModal(false);
    history.replace(HOME_PATH);
  };

  return {
    checkinToPrivateMeeting: checkinToPrivateMeetingCallback,
    cancelCheckinToPrivateMeeting: cancelCheckinToPrivateMeetingCallback,
  };
}
