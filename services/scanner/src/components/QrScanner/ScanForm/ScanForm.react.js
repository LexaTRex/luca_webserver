import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { Tick } from 'react-crude-animated-tick';

import { hexToBase64 } from '@lucaapp/crypto';

import {
  getV3BadgeCheckinPayload,
  getV4BadgeCheckinPayload,
  getV3AppCheckinPayload,
  getTraceId,
  notifyScanError,
  DECODE_FAILED,
  TIMESTAMP_OUTDATED,
  DOUPLICATE_CHECKIN,
  VERSION_NOT_SUPPORTED,
  WRONG_LOCAL_TIME,
} from 'helpers';

import {
  createCheckinV3,
  getCurrentCount,
  getTotalCount,
  getAdditionalData,
} from 'network/api';

import { decode, STATIC_DEVICE_TYPE } from 'utils/qr';

import { isLocalTimeCorrect } from 'helpers/time';
import { SCAN_TIMEOUT } from 'constants/timeouts';
import { useModal } from 'components/hooks/useModal';
import { MINIMAL_SUPPORT_VERION } from 'constants/versionSupport';
import { AdditionalDataModal } from 'components/modals/AdditionalDataModal';

import {
  FormWrapper,
  Wrapper,
  Content,
  Count,
  HiddenInput,
  SuccessOverlay,
} from './ScanForm.styled';

export const ScanForm = ({ scanner }) => {
  const intl = useIntl();
  const [openModal, closeModal] = useModal();
  const [isSuccess, setIsSuccess] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputReference = useRef(null);
  const debounceTimeout = useRef(null);

  const triggerFocus = useCallback(() => {
    if (!inputReference.current) return;
    inputReference.current.focus();
  }, [inputReference]);

  const { data: currentCount } = useQuery(
    'current',
    () =>
      getCurrentCount(scanner.scannerAccessId).then(response =>
        response.json()
      ),
    {
      refetchInterval: 500,
    }
  );

  const { data: totalCount } = useQuery(
    'total',
    () =>
      getTotalCount(scanner.scannerAccessId).then(response => response.json()),
    {
      refetchInterval: 500,
    }
  );

  const { data: additionalData } = useQuery('additionalData', () =>
    getAdditionalData(scanner.locationId).then(response => response.json())
  );

  const checkForAdditionalData = traceId => {
    if (
      !scanner.tableCount &&
      !additionalData?.additionalData?.some(field => field.isRequired)
    ) {
      return;
    }

    openModal({
      title: intl.formatMessage({
        id: 'modal.additionalData.title',
      }),
      content: (
        <AdditionalDataModal
          scanner={scanner}
          additionalData={additionalData.additionalData}
          traceId={traceId}
          close={() => {
            closeModal();
            triggerFocus();
          }}
        />
      ),
      closable: false,
    });
  };

  const onSubmit = async event => {
    if (event) event.preventDefault();
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    const qrData = await decode(inputValue);

    const timeCorrect = await isLocalTimeCorrect();
    if (!timeCorrect) {
      notifyScanError(WRONG_LOCAL_TIME, intl);
      return;
    }

    setInputValue('');
    if (!qrData) {
      notifyScanError(DECODE_FAILED, intl, triggerFocus);

      inputReference.current.focus();
      return;
    }

    if (qrData.v < MINIMAL_SUPPORT_VERION) {
      notifyScanError(VERSION_NOT_SUPPORTED, intl, triggerFocus);
      return;
    }

    if (qrData.v === 3) {
      let v3payload;
      let traceId;

      if (qrData.deviceType === STATIC_DEVICE_TYPE) {
        // static qr codes
        traceId = hexToBase64(getTraceId(qrData.tracingSeed));
        v3payload = getV3BadgeCheckinPayload(qrData, scanner);
      } else {
        // App with v3
        // Check that qr code is not older than 5 minutes
        const now = Date.now() / 1000;
        if (Math.abs(now - qrData.timestamp) > 300) {
          notifyScanError(TIMESTAMP_OUTDATED, intl, triggerFocus);
          return;
        }

        traceId = qrData.traceId;
        v3payload = getV3AppCheckinPayload(scanner, qrData);
      }

      createCheckinV3(v3payload)
        .then(response => {
          if (response.status === 409) {
            notifyScanError(DOUPLICATE_CHECKIN, intl, triggerFocus);
            return;
          }
          setIsSuccess(true);
          setInputValue('');
          setTimeout(() => {
            setIsSuccess(false);
          }, SCAN_TIMEOUT);
          checkForAdditionalData(traceId);
        })
        .catch(error => notifyScanError(error, intl, triggerFocus));
      return;
    }
    if (qrData.v === 4 && qrData.deviceType === STATIC_DEVICE_TYPE) {
      const v4BadgePayload = await getV4BadgeCheckinPayload(qrData, scanner);
      createCheckinV3(v4BadgePayload)
        .then(response => {
          if (response.status === 409) {
            notifyScanError(DOUPLICATE_CHECKIN, intl, triggerFocus);
            return;
          }
          setIsSuccess(true);
          setInputValue('');
          setTimeout(() => {
            setIsSuccess(false);
          }, SCAN_TIMEOUT);
          checkForAdditionalData(v4BadgePayload.traceId);
        })
        .catch(error => notifyScanError(error, intl, triggerFocus));
      return;
    }
    notifyScanError(VERSION_NOT_SUPPORTED, intl, triggerFocus);
  };

  const handleChange = event => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    setInputValue(event.target.value);

    // if value ends with `` it's possible that the submit was supressed
    if (!event.target.value.endsWith('``')) return;
    debounceTimeout.current = setTimeout(() => {
      onSubmit();
    }, 200);
  };

  useEffect(() => {
    const focusInput = () => {
      inputReference.current.focus();
    };

    window.addEventListener('focus', focusInput);
    return () => {
      window.removeEventListener('focus', focusInput);
    };
  }, []);

  useEffect(() => {
    triggerFocus();
  }, [triggerFocus]);

  return (
    <Wrapper onClick={triggerFocus}>
      <FormWrapper>
        <Content>
          {intl.formatMessage({
            id: 'form.checkins',
          })}
          <b>{scanner.name}</b>
          {intl.formatMessage({
            id: 'form.checkinsSuffix',
          })}
          <Count>
            {currentCount}/{totalCount}
          </Count>
        </Content>
        {isSuccess ? (
          <SuccessOverlay />
        ) : (
          <form onSubmit={onSubmit}>
            <HiddenInput
              type="text"
              ref={inputReference}
              autoFocus
              autoComplete="off"
              value={inputValue}
              onChange={handleChange}
            />
          </form>
        )}

        {isSuccess && <Tick size={200} />}
      </FormWrapper>
    </Wrapper>
  );
};
