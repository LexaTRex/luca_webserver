import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { Tick } from 'react-crude-animated-tick';

import { getCurrentCount, getTotalCount, getAdditionalData } from 'network/api';

import { handleScanData } from 'helpers';

import { useModal } from 'components/hooks/useModal';
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

    handleScanData({
      scanData: inputValue,
      intl,
      scanner,
      setIsSuccess,
      checkForAdditionalData,
    });
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
