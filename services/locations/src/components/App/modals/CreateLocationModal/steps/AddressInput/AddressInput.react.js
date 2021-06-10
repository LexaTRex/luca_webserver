import React, { useState, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Button, Form } from 'antd';

import { LoadScript } from '@react-google-maps/api';

import { GOOGLE_LIBRARIES, GOOGLE_MAPS_API_KEY } from 'constants/googleApi';

import { FormFields } from './FormFields';
import { LocationSearch } from './LocationSearch';
import { AddressWrapper, Address } from './AddressInput.styled';
import { ManualAddressText } from '../../../generalOnboarding/ManualAddressText';
import {
  nextButtonStyles,
  backButtonStyles,
  disabledStyles,
  noButtonStyles,
  Wrapper,
  Header,
  Description,
  ButtonWrapper,
  ManualInputButton,
} from '../../../generalOnboarding/Onboarding.styled';

import { BASE_ADDRESS_INDICATOR } from '../../CreateLocationModal.helper';

export const AddressInput = ({
  baseLocation,
  address: currentAddress,
  setAddress,
  locationType,
  back,
  next,
}) => {
  const intl = useIntl();
  const formReference = useRef(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [temporaryAddress, setTemporaryAddress] = useState(currentAddress);
  const [isError, setIsError] = useState(false);
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [filled, setFilled] = useState(!!temporaryAddress);
  const [disabled, setDisabled] = useState(true);

  const onFinish = values => {
    setTemporaryAddress(values);
    setAddress(values);
    next();
  };

  const onNext = () => {
    setAddress(BASE_ADDRESS_INDICATOR);
    next();
  };

  return (
    <>
      {!isNewAddress ? (
        <Wrapper>
          <Header>
            {intl.formatMessage({
              id: `modal.createLocation.addressInput.${locationType}.title`,
            })}
          </Header>
          <Description>
            {intl.formatMessage({
              id: `modal.createLocation.addressInput.${locationType}.sameAddress.description`,
            })}
          </Description>
          <AddressWrapper>
            <Address>
              {`${baseLocation.streetName} ${baseLocation.streetNr}`}
            </Address>
            <Address>{`${baseLocation.zipCode} ${baseLocation.city}`}</Address>
          </AddressWrapper>
          <ButtonWrapper
            multipleButtons
            style={isNewAddress ? { justifyContent: 'flex-end' } : {}}
          >
            <Button style={backButtonStyles} onClick={back}>
              {intl.formatMessage({
                id: 'authentication.form.button.back',
              })}
            </Button>
            <div>
              <Button
                data-cy="no"
                style={{ ...noButtonStyles, marginRight: 24 }}
                onClick={() => setIsNewAddress(true)}
              >
                {intl.formatMessage({
                  id: 'no',
                })}
              </Button>
              <Button data-cy="yes" style={nextButtonStyles} onClick={onNext}>
                {intl.formatMessage({
                  id: 'yes',
                })}
              </Button>
            </div>
          </ButtonWrapper>
        </Wrapper>
      ) : (
        <Wrapper>
          <Header>
            {intl.formatMessage({
              id: `modal.createLocation.addressInput.${locationType}.title`,
            })}
          </Header>
          <Description>
            {intl.formatMessage({
              id: `modal.createLocation.addressInput.${locationType}.description`,
            })}
          </Description>
          <Description
            style={{
              fontWeight: 'bold',
              fontFamily: 'Montserrat-bold,sans-serif',
            }}
          >
            {intl.formatMessage({
              id: 'modal.addressInput.help.description',
            })}
          </Description>
          <LoadScript
            googleMapsApiKey={GOOGLE_MAPS_API_KEY}
            libraries={GOOGLE_LIBRARIES}
          >
            <Form
              ref={formReference}
              onFinish={onFinish}
              initialValues={temporaryAddress}
            >
              <LocationSearch
                formReference={formReference}
                setFilled={setFilled}
                setDisabled={setDisabled}
                isError={isError}
                setIsError={setIsError}
              />
              <ManualInputButton onClick={() => setShowManualInput(true)}>
                {intl.formatMessage({ id: 'addressInput.manualInputTitle' })}
              </ManualInputButton>
              {showManualInput && <ManualAddressText />}
              <FormFields
                disabled={disabled}
                show={filled || showManualInput}
              />
              <ButtonWrapper multipleButtons>
                <Button
                  onClick={back}
                  data-cy="previousStep"
                  style={backButtonStyles}
                >
                  {intl.formatMessage({
                    id: 'authentication.form.button.back',
                  })}
                </Button>
                <Button
                  data-cy="nextStep"
                  disabled={isError || (!filled && !showManualInput)}
                  style={
                    isError || (!filled && !showManualInput)
                      ? disabledStyles
                      : nextButtonStyles
                  }
                  onClick={() => formReference.current.submit()}
                >
                  {intl.formatMessage({
                    id: 'authentication.form.button.next',
                  })}
                </Button>
              </ButtonWrapper>
            </Form>
          </LoadScript>
        </Wrapper>
      )}
    </>
  );
};
