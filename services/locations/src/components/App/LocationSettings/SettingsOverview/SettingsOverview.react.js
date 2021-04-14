import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, Button, notification } from 'antd';

import { updateLocation } from 'network/api';

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
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const formReference = useRef(null);

  const onFinish = values => {
    updateLocation({
      locationId: location.uuid,
      data: {
        ...values,
        locationName: location.name === null ? undefined : values.locationName,
      },
    })
      .then(() => {
        refetch();
        notification.success({
          message: intl.formatMessage({
            id: 'notification.updateLocation.success',
          }),
          className: 'editLocationSuccess',
        });
        setIsButtonDisabled(true);
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'notification.updateLocation.error',
          }),
        });
      });
  };

  const submitForm = () => {
    formReference.current.submit();
  };

  const onValueUpdate = (_, values) => {
    if (!values.locationName) {
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

  return (
    <Overview isLast={isLast}>
      <Heading>{intl.formatMessage({ id: 'profile.overview' })}</Heading>
      <Form
        onFinish={onFinish}
        style={{ maxWidth: 350 }}
        ref={formReference}
        initialValues={{
          locationName:
            location.name || intl.formatMessage({ id: 'location.defaultName' }),
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
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'error.locationName',
              }),
            },
          ]}
        >
          <Input disabled={location.name === null} />
        </Form.Item>
        <Form.Item
          name="phone"
          colon={false}
          label={intl.formatMessage({
            id: 'settings.location.phone',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'error.phone',
              }),
            },
          ]}
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
