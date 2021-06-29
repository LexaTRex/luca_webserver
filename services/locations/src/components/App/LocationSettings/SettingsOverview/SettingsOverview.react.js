import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, Button, notification } from 'antd';

import { updateLocation } from 'network/api';

import { getFormattedPhoneNumber } from 'utils/parsePhoneNumber';
import {
  getPhoneRules,
  getRequiredRule,
  showErrorNotification,
  checkExistingLocation,
  getDefaultNameRule,
} from 'utils/validatorRules';

import {
  requiresLocationName,
  updateLocationNotificationError,
} from 'constants/errorMessages';

import {
  buttonStyles,
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

  const handleServerError = () => {
    showErrorNotification(notification, intl, updateLocationNotificationError);
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
    const { phone } = values;
    const formattedPhoneNumber = getFormattedPhoneNumber(phone);
    updateLocation({
      locationId: location.uuid,
      data: {
        phone: formattedPhoneNumber,
        locationName:
          location.name === null ? undefined : values.locationName.trim(),
      },
    })
      .then(response => {
        refetch();
        formReference.current?.setFieldsValue({ phone: formattedPhoneNumber });
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

  const locationNameRules = [
    getDefaultNameRule(intl),
    {
      required: isLocationNameTaken,
      validator: checkExistingLocation(isLocationNameTaken, intl),
    },
  ];
  if (location.name !== null) {
    locationNameRules.push(getRequiredRule(intl, requiresLocationName));
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
          rules={[getPhoneRules(intl)]}
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
        <Button
          onClick={submitForm}
          style={buttonStyles}
          disabled={isButtonDisabled}
          data-cy="editLocation"
        >
          {intl.formatMessage({ id: 'profile.overview.submit' })}
        </Button>
      </ButtonWrapper>
    </Overview>
  );
};
