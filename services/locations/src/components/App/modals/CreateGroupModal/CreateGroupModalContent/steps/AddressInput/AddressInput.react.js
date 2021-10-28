import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Form } from 'antd';
import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';
import { ManualAddressText } from 'components/App/modals/generalOnboarding/ManualAddressText';
import { GooglePlacesWrapper } from 'components/App/modals/generalOnboarding/GooglePlacesWrapper';
import {
  ButtonWrapper,
  Description,
  Header,
  ManualInputButton,
  Wrapper,
} from 'components/App/modals/generalOnboarding/Onboarding.styled';
import { LocationSearch } from './LocationSearch';
import { FormFields } from './FormFields';

export const AddressInput = ({
  address: currentAddress,
  setAddress,
  groupType,
  back,
  next,
  googleEnabled,
}) => {
  const intl = useIntl();
  const formReference = useRef(null);
  const [showManualInput, setShowManualInput] = useState(!googleEnabled);
  const [temporaryAddress, setTemporaryAddress] = useState(currentAddress);
  const [isError, setIsError] = useState(false);
  const [filled, setFilled] = useState(!!temporaryAddress);
  const [disabled, setDisabled] = useState(googleEnabled);

  const onFinish = values => {
    setTemporaryAddress(values);
    setAddress(values);
    next();
  };

  return (
    <Wrapper>
      <Header>
        {intl.formatMessage({
          id: `modal.createGroup.addressInput.${groupType}.title`,
        })}
      </Header>
      <Description>
        {intl.formatMessage({
          id: `modal.createGroup.addressInput.${groupType}.description`,
        })}
      </Description>
      <Description
        style={{ fontWeight: 'bold', fontFamily: 'Montserrat-bold,sans-serif' }}
      >
        {intl.formatMessage({
          id: 'modal.addressInput.help.description',
        })}
      </Description>
      <GooglePlacesWrapper enabled={googleEnabled}>
        <Form
          ref={formReference}
          onFinish={onFinish}
          initialValues={temporaryAddress}
        >
          {googleEnabled ? (
            <>
              <LocationSearch
                formReference={formReference}
                setFilled={setFilled}
                setDisabled={setDisabled}
                isError={isError}
                setIsError={setIsError}
              />
              <ManualInputButton
                data-cy="manuellSearch"
                onClick={() => {
                  setDisabled(false);
                  setShowManualInput(true);
                }}
              >
                {intl.formatMessage({ id: 'addressInput.manualInputTitle' })}
              </ManualInputButton>
            </>
          ) : (
            <ManualAddressText />
          )}

          <FormFields show={filled || showManualInput} disabled={disabled} />
          <ButtonWrapper multipleButtons>
            <SecondaryButton onClick={back}>
              {intl.formatMessage({
                id: 'authentication.form.button.back',
              })}
            </SecondaryButton>
            <PrimaryButton
              data-cy="proceed"
              disabled={isError || (!filled && !showManualInput)}
              onClick={() => formReference.current.submit()}
            >
              {intl.formatMessage({
                id: 'authentication.form.button.next',
              })}
            </PrimaryButton>
          </ButtonWrapper>
        </Form>
      </GooglePlacesWrapper>
    </Wrapper>
  );
};
