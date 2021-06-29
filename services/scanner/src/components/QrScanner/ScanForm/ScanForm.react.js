import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { useQueryClient, useQuery } from 'react-query';
import { Tick } from 'react-crude-animated-tick';

import { getCurrentCount, getTotalCount, getAdditionalData } from 'network/api';
import { REFETCH_INTERVAL_MS } from 'constants/timeouts';

import { handleScanData } from 'helpers';

import { useModal } from 'components/hooks/useModal';
import { AdditionalDataModal } from 'components/modals/AdditionalDataModal';
import { Update } from 'components/Update';

import {
  FormWrapper,
  Wrapper,
  Content,
  Count,
  HiddenInput,
  SuccessOverlay,
} from './ScanForm.styled';

export const ScanForm = ({ scanner, outerFocus, setOuterFocus }) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [openModal, closeModal] = useModal();
  const [isSuccess, setIsSuccess] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [latestUpdate, setLatestUpdate] = useState(moment().unix());
  const inputReference = useRef(null);
  const debounceTimeout = useRef(null);
  const isOpen = useSelector(({ modal }) => !!modal);

  const triggerFocus = useCallback(() => {
    if (!inputReference.current) return;
    inputReference.current.focus();
  }, [inputReference]);

  const { data: currentCount } = useQuery(
    'current',
    () =>
      getCurrentCount(scanner.scannerAccessId).then(response => {
        setLatestUpdate(moment().unix());
        return response.json();
      }),
    {
      refetchInterval: REFETCH_INTERVAL_MS,
    }
  );

  const { data: totalCount } = useQuery(
    'total',
    () =>
      getTotalCount(scanner.scannerAccessId).then(response => response.json()),
    {
      refetchInterval: REFETCH_INTERVAL_MS,
    }
  );

  const refetch = () => {
    queryClient.invalidateQueries('total');
    queryClient.invalidateQueries('current');
    triggerFocus();
  };

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

  const onSubmit = event => {
    if (event) event.preventDefault();
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    handleScanData({
      scanData: inputValue,
      intl,
      scanner,
      setIsSuccess,
      checkForAdditionalData,
      refetch,
    });

    setInputValue('');
  };

  const handleChange = event => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    setInputValue(event.target.value);

    // if value ends with `` it's possible that the submit was suppressed
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
    if (outerFocus) setOuterFocus(false);
    triggerFocus();
  }, [outerFocus, triggerFocus, setOuterFocus]);

  return (
    <>
      <Update latestUpdate={latestUpdate} callback={refetch} cam={false} />
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
                autoFocus={!isOpen}
                autoComplete="off"
                value={inputValue}
                onChange={handleChange}
              />
            </form>
          )}

          {isSuccess && <Tick size={200} />}
        </FormWrapper>
      </Wrapper>
    </>
  );
};
