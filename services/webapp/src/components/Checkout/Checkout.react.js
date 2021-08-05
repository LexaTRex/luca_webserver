import React, { useCallback, useEffect, useMemo, useState } from 'react';

import moment from 'moment';
import { notification } from 'antd';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { base64UrlToBytes } from '@lucaapp/crypto';

import { checkout } from 'helpers/crypto';
import { getSession } from 'helpers/history';
import { getLocation } from 'helpers/locations';
import { AppLayout } from 'components/AppLayout';
import { CHECK_OUT_LOCATION_TYPE, HOME_PATH } from 'constants/routes';
import { WEBAPP_WARNING_MODAL_SHOWN_SESSION_KEY } from 'constants/storage';
import { useTraceClock } from 'hooks/useTraceClock';
import { useUserSession } from 'contexts/userSessionContext';

import {
  StyledAppHeadline,
  StyledInfoText,
  StyledLocationInfoText,
  StyledWrapper,
} from './Checkout.styled';
import { CheckoutButton } from './CheckoutButton';
import { TimerDisplay } from './TimerDisplay';
import { LocationInfoContainer } from './LocationInfoContainer';

export function CheckOut({ location: { search } }) {
  const intl = useIntl();
  const history = useHistory();
  const { checkin, setCheckin } = useUserSession();
  const clock = useTraceClock();

  const { traceId, type } = useMemo(() => {
    const searchParameters = new URLSearchParams(search);
    return {
      traceId: searchParameters.get('traceId'),
      type: searchParameters.get('type') || CHECK_OUT_LOCATION_TYPE,
    };
  }, [search]);
  const [session, setSession] = useState();
  const [location, setLocation] = useState();
  const [additionalData, setAdditionalData] = useState();

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
    if (session && session?.locationId) {
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
            setCheckin(null);
            history.push(HOME_PATH);
            return;
          }

          if (apiSession.checkin && checkin) {
            setCheckin(checkin);
          } else {
            setCheckin(moment().unix());
          }

          if (apiSession.checkout) {
            const timestamp = moment().unix();
            setCheckin(null);
            setSession({ ...apiSession, checkin: timestamp });
            return;
          }
          setSession(apiSession);
        })
        .catch(() => {
          handleError();
        });
    } else {
      history.push(HOME_PATH);
    }
  }, [history, traceId, intl, type, handleError, setCheckin, checkin]);

  useEffect(() => {
    if (!window.location.hash) return;
    const [key, value] = Object.entries(
      JSON.parse(base64UrlToBytes(window.location.hash.slice(1)))
    )[0];
    const label =
      key === 'table' ? intl.formatMessage({ id: 'Checkout.table' }) : key;

    setAdditionalData(`${label}: ${value}`);
  }, [intl, setCheckin]);

  const onCheckout = async () => {
    await checkout(traceId);
    setCheckin(null);
    sessionStorage.removeItem(WEBAPP_WARNING_MODAL_SHOWN_SESSION_KEY);
    history.push(HOME_PATH);
  };

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'Checkout.PageTitle' })}</title>
      </Helmet>
      <AppLayout
        header={
          <StyledAppHeadline color="#000" data-cy="locationName">
            {location?.name}
          </StyledAppHeadline>
        }
        bgColor="linear-gradient(-180deg, rgb(211, 222, 195) 0%, rgb(132, 137, 101) 100%);"
      >
        <LocationInfoContainer session={session}>
          {additionalData &&
            Object.keys(additionalData).map(valueKey => (
              <StyledLocationInfoText key={valueKey}>
                {valueKey[0].toUpperCase() + valueKey.slice(1)}:{' '}
                {additionalData[valueKey]}
              </StyledLocationInfoText>
            ))}
        </LocationInfoContainer>

        <StyledWrapper>
          <StyledInfoText>
            {intl.formatMessage({ id: 'Checkout.CurrentLocation' })}
          </StyledInfoText>
          <TimerDisplay
            hour={clock.hour}
            minute={clock.minute}
            seconds={clock.seconds}
          />
        </StyledWrapper>
        <CheckoutButton disabled={!clock.allowCheckout} onClick={onCheckout}>
          {intl.formatMessage({ id: 'Checkout.CheckOutButton' })}
        </CheckoutButton>
      </AppLayout>
    </>
  );
}
