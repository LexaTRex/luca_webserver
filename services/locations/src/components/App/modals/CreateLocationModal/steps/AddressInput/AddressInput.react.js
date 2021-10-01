import React, { useState, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Form } from 'antd';
import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';

import { LoadScript } from '@react-google-maps/api';

import { GOOGLE_LIBRARIES, GOOGLE_MAPS_API_KEY } from 'constants/googleApi';

import { FormFields } from './FormFields';
import { LocationSearch } from './LocationSearch';
import { AddressWrapper, Address } from './AddressInput.styled';
import { ManualAddressText } from '../../../generalOnboarding/ManualAddressText';
import {
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
            <SecondaryButton onClick={back}>
              {intl.formatMessage({
                id: 'authentication.form.button.back',
              })}
            </SecondaryButton>
            <div>
              <PrimaryButton
                data-cy="no"
                $isButtonWhite
                style={{ marginRight: 24 }}
                onClick={() => setIsNewAddress(true)}
              >
                {intl.formatMessage({
                  id: 'no',
                })}
              </PrimaryButton>
              <PrimaryButton data-cy="yes" onClick={onNext}>
                {intl.formatMessage({
                  id: 'yes',
                })}
              </PrimaryButton>
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
              <ManualInputButton
                onClick={() => {
                  setShowManualInput(true);
                  setDisabled(false);
                }}
              >
                {intl.formatMessage({ id: 'addressInput.manualInputTitle' })}
              </ManualInputButton>
              {showManualInput && <ManualAddressText />}
              <FormFields
                disabled={disabled}
                show={filled || showManualInput}
              />
              <ButtonWrapper multipleButtons>
                <SecondaryButton onClick={back} data-cy="previousStep">
                  {intl.formatMessage({
                    id: 'authentication.form.button.back',
                  })}
                </SecondaryButton>
                <PrimaryButton
                  data-cy="nextStep"
                  disabled={isError || (!filled && !showManualInput)}
                  onClick={() => formReference.current.submit()}
                >
                  {intl.formatMessage({
                    id: 'authentication.form.button.next',
                  })}
                </PrimaryButton>
              </ButtonWrapper>
            </Form>
          </LoadScript>
        </Wrapper>
      )}
    </>
  );
};
