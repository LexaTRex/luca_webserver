import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, notification } from 'antd';
import { PrimaryButton } from 'components/general/Buttons.styled';

import { updateLocation } from 'network/api';

// hooks
import {
  useLocationNameValidator,
  usePhoneValidator,
} from 'components/hooks/useValidators';

import { getFormattedPhoneNumber } from 'utils/parsePhoneNumber';

import { getDefaultNameRule, getUniqueNameRule } from 'utils/validatorRules';

import {
  Overview,
  Heading,
  ButtonWrapper,
  AddressRow,
  AddressHeader,
  Address,
} from './SettingsOverview.styled';

export const SettingsOverview = ({ location, isLast, refetch }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const formReference = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLocationNameTaken, setIsLocationNameTaken] = useState(false);

  const locationNameValidator = useLocationNameValidator('locationName');
  const phoneValidator = usePhoneValidator('phone');

  const handleServerError = () => {
    notification.error({
      message: intl.formatMessage({ id: 'notification.updateLocation.error' }),
    });
  };

  const handleResponse = response => {
    switch (response.status) {
      case 200:
        notification.success({
          message: intl.formatMessage({
            id: 'notification.updateLocation.success',
          }),
          className: 'editLocationSuccess',
        });
        setIsButtonDisabled(true);
        break;
      case 409:
        setIsLocationNameTaken(true);
        form.validateFields(['locationName']);
        break;
      default:
        handleServerError();
        break;
    }
  };

  const onFinish = values => {
    const { phone, locationName } = values;
    const formattedPhoneNumber = getFormattedPhoneNumber(phone);
    const formattedLocationName = locationName?.trim();
    updateLocation({
      locationId: location.uuid,
      data: {
        phone: formattedPhoneNumber,
        locationName:
          location.name === null ? undefined : formattedLocationName,
      },
    })
      .then(response => {
        refetch();
        formReference.current?.setFieldsValue({
          phone: formattedPhoneNumber,
          locationName: formattedLocationName,
        });
        handleResponse(response);
      })
      .catch(() => {
        handleServerError();
      });
  };

  const submitForm = () => {
    formReference.current.submit();
  };

  const onValueUpdate = (_, values) => {
    setIsLocationNameTaken(false);
    if (!values.locationName && location.name !== null) {
      setIsButtonDisabled(true);
      return;
    }

    if (
      values.locationName !== location.name ||
      values.phone !== location.phone
    ) {
      setIsButtonDisabled(false);
      return;
    }

    setIsButtonDisabled(true);
  };

  let locationNameRules = [
    getDefaultNameRule(intl),
    getUniqueNameRule(intl, isLocationNameTaken),
  ];
  if (location.name !== null) {
    locationNameRules = [...locationNameRules, ...locationNameValidator];
  }

  return (
    <Overview isLast={isLast}>
      <Heading>{intl.formatMessage({ id: 'profile.overview' })}</Heading>
      <Form
        onFinish={onFinish}
        style={{ maxWidth: 350 }}
        form={form}
        ref={formReference}
        initialValues={{
          locationName: location.name,
          phone: location.phone,
        }}
        onValuesChange={onValueUpdate}
      >
        <Form.Item
          colon={false}
          name="locationName"
          label={intl.formatMessage({
            id: 'settings.location.name',
          })}
          rules={locationNameRules}
        >
          <Input
            disabled={location.name === null}
            placeholder={
              location.name === null
                ? intl.formatMessage({ id: 'location.defaultName' })
                : ''
            }
          />
        </Form.Item>
        <Form.Item
          name="phone"
          colon={false}
          label={intl.formatMessage({
            id: 'settings.location.phone',
          })}
          rules={phoneValidator}
        >
          <Input />
        </Form.Item>
      </Form>
      <Address>
        <AddressHeader>
          {intl.formatMessage({ id: 'settings.location.address' })}
        </AddressHeader>
        <AddressRow>{`${location.streetName} ${location.streetNr}`}</AddressRow>
        <AddressRow>{`${location.zipCode} ${location.city}`}</AddressRow>
      </Address>
      <ButtonWrapper>
        <PrimaryButton
          onClick={submitForm}
          disabled={isButtonDisabled}
          data-cy="editLocation"
        >
          {intl.formatMessage({ id: 'profile.overview.submit' })}
        </PrimaryButton>
      </ButtonWrapper>
    </Overview>
  );
};
