import React, { useEffect, useState, useMemo, useCallback } from 'react';

import moment from 'moment';
import { useIntl } from 'react-intl';
import { notification } from 'antd';
import useInterval from '@use-it/interval';
import { useHistory } from 'react-router-dom';

import { checkout } from 'helpers/crypto';
import { getSession } from 'helpers/history';
import { getLocation } from 'helpers/locations';
import { base64UrlToBytes } from 'utils/encodings';
import { HOME_PATH, CHECK_OUT_LOCATION_TYPE } from 'constants/routes';

import { AppContent, AppLayout } from '../AppLayout';
import {
  StyledTime,
  StyledTimeType,
  StyledInfoText,
  StyledAppHeadline,
  StyledCheckInTime,
  StyledCheckoutButton,
  StyledLocationInfoText,
  StyledCheckInTimeContainer,
  StyledLocationInfoContainer,
  StyledLocationInfoTextContainer,
  StyledNumberOfAccountsOnThisLocation,
} from './Checkout.styled';

export function CheckOut({ location: { search } }) {
  const intl = useIntl();
  const history = useHistory();
  const { traceId, type } = useMemo(() => {
    const searchParameters = new URLSearchParams(search);
    return {
      traceId: searchParameters.get('traceId'),
      type: searchParameters.get('type') || CHECK_OUT_LOCATION_TYPE,
    };
  }, [search]);
  const [clock, setClock] = useState({
    hour: '00',
    minute: '00',
    seconds: '00',
  });
  const [session, setSession] = useState();
  const [location, setLocation] = useState();
  const [additionalData, setAdditionalData] = useState();
  const [isCheckoutAllowed, setIsCheckoutAllowed] = useState(false);

  const traceClock = useCallback(() => {
    if (session?.checkin) {
      const time = moment.duration(moment().diff(moment.unix(session.checkin)));
      setClock({
        hour: time.hours().toString().padStart(2, '0'),
        minute: time.minutes().toString().padStart(2, '0'),
        seconds: time.seconds().toString().padStart(2, '0'),
      });

      if (time.minutes() >= 2) {
        setIsCheckoutAllowed(true);
      } else {
        setIsCheckoutAllowed(false);
      }
    }
  }, [session?.checkin]);

  useInterval(traceClock, 1000);
  useEffect(() => {
    traceClock();
  }, [traceClock]);

  const handleError = useCallback(() => {
    notification.error({
      message: intl.formatMessage({
        id: 'error.headline',
      }),
      description: intl.formatMessage({
        id: 'error.description',
      }),
    });
  }, [intl]);

  useEffect(() => {
    if (session && session.locationId) {
      getLocation(session.locationId)
        .then(apiLocation => {
          setLocation(apiLocation);
          setAdditionalData(apiLocation.additionalData);
        })
        .catch(() => {
          handleError();
        });
    }
  }, [intl, session, type, handleError]);

  useEffect(() => {
    if (traceId) {
      getSession(traceId)
        .then(apiSession => {
          if (!apiSession) {
            history.push(HOME_PATH);
            return;
          }

          if (!apiSession.checkout) {
            const time = moment.duration(
              moment().diff(moment.unix(apiSession.checkin))
            );
            if (time.minutes() < 1 && time.hours() === 0) {
              setSession({ ...apiSession, checkin: moment().unix() });
              return;
            }

            setSession(apiSession);
            return;
          }

          history.push(HOME_PATH);
        })
        .catch(() => {
          handleError();
        });
    } else {
      history.push(HOME_PATH);
    }
  }, [history, traceId, intl, type, handleError]);

  useEffect(() => {
    if (!window.location.hash) return;

    const [key, value] = Object.entries(
      JSON.parse(base64UrlToBytes(window.location.hash.slice(1)))
    )[0];

    const label =
      key === 'table' ? intl.formatMessage({ id: 'Checkout.table' }) : key;

    setAdditionalData(`${label}: ${value}`);
  }, [intl]);

  return (
    <AppLayout
      header={
        <StyledAppHeadline color="#000">{location?.name}</StyledAppHeadline>
      }
      bgColor="linear-gradient(-180deg, rgb(211, 222, 195) 0%, rgb(132, 137, 101) 100%);"
    >
      <AppContent noCentering>
        <StyledLocationInfoContainer>
          <StyledLocationInfoTextContainer>
            <StyledLocationInfoText>
              {intl.formatMessage({ id: 'Checkout.YouAreCheckIn' })}
            </StyledLocationInfoText>
            <StyledLocationInfoText>
              {intl.formatMessage({ id: 'Checkout.CheckIn' })}{' '}
              {session?.checkin &&
                `${moment
                  .unix(session?.checkin)
                  .format('DD.MM.YYYY - HH.mm')} Uhr`}
            </StyledLocationInfoText>
            {additionalData &&
              Object.keys(additionalData).map(valueKey => (
                <StyledLocationInfoText key={valueKey}>
                  {valueKey[0].toUpperCase() + valueKey.slice(1)}:{' '}
                  {additionalData[valueKey]}
                </StyledLocationInfoText>
              ))}
          </StyledLocationInfoTextContainer>
          <StyledNumberOfAccountsOnThisLocation />
        </StyledLocationInfoContainer>
      </AppContent>
      <AppContent>
        <StyledInfoText>
          {intl.formatMessage({ id: 'Checkout.CurrentLocation' })}
        </StyledInfoText>
        <StyledCheckInTimeContainer>
          <StyledCheckInTime>
            <StyledTime>{clock.hour}</StyledTime>
            <StyledTimeType>h</StyledTimeType>
          </StyledCheckInTime>
          <StyledCheckInTime>
            <StyledTime>:{clock.minute}</StyledTime>
            <StyledTimeType isNotHours>min</StyledTimeType>
          </StyledCheckInTime>
          <StyledCheckInTime>
            <StyledTime>:{clock.seconds}</StyledTime>
            <StyledTimeType isNotHours>s</StyledTimeType>
          </StyledCheckInTime>
        </StyledCheckInTimeContainer>
      </AppContent>
      <AppContent>
        <StyledCheckoutButton
          disabled={!isCheckoutAllowed}
          onClick={async () => {
            await checkout(traceId);
            history.push(HOME_PATH);
          }}
        >
          {intl.formatMessage({ id: 'Checkout.CheckOutButton' })}
        </StyledCheckoutButton>
      </AppContent>
    </AppLayout>
  );
}
