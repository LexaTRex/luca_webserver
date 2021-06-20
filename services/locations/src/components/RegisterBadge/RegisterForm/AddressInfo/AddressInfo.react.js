import React from 'react';
import { useIntl } from 'react-intl';
import { Input, Button, Form, notification } from 'antd';

import {
  MAX_CITY_LENGTH,
  MAX_STREET_LENGTH,
  MAX_POSTAL_CODE_LENGTH,
  MAX_HOUSE_NUMBER_LENGTH,
} from 'constants/valueLength';

import {
  ContentWrapper,
  ContentTitle,
  ButtonRow,
} from '../RegisterForm.styled';

const lengthErrorMessageId = 'error.length';

export const AddressInfo = ({ title, next, back, form, setValues }) => {
  const intl = useIntl();

  const handleNext = () => {
    form.current
      .validateFields()
      .then(response => {
        setValues(response);
        next();
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'error.registerBadge.invalidAddress',
          }),
        });
      });
  };

  return (
    <ContentWrapper>
      <ContentTitle>{title}</ContentTitle>
      <Form.Item
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'error.streetName',
            }),
          },
          {
            max: MAX_STREET_LENGTH,
            message: intl.formatMessage({
              id: lengthErrorMessageId,
            }),
          },
        ]}
        label={intl.formatMessage({
          id: 'registerBadge.street',
        })}
        name="street"
      >
        <Input />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'error.streetNr',
            }),
          },
          {
            max: MAX_HOUSE_NUMBER_LENGTH,
            message: intl.formatMessage({
              id: lengthErrorMessageId,
            }),
          },
        ]}
        label={intl.formatMessage({
          id: 'registerBadge.streetNumber',
        })}
        name="streetNumber"
      >
        <Input />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'error.zipCode',
            }),
          },
          {
            max: MAX_POSTAL_CODE_LENGTH,
            message: intl.formatMessage({
              id: lengthErrorMessageId,
            }),
          },
        ]}
        label={intl.formatMessage({
          id: 'registerBadge.zip',
        })}
        name="zip"
      >
        <Input />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'error.city',
            }),
          },
          {
            max: MAX_CITY_LENGTH,
            message: intl.formatMessage({
              id: lengthErrorMessageId,
            }),
          },
        ]}
        label={intl.formatMessage({
          id: 'registerBadge.city',
        })}
        name="city"
      >
        <Input />
      </Form.Item>
      <ButtonRow multipleButtons>
        <Button
          onClick={back}
          style={{
            color: 'black',
            border: '1px solid #b8c0ca',
          }}
        >
          {intl.formatMessage({ id: 'registerBadge.back' })}
        </Button>
        <Button
          onClick={handleNext}
          style={{
            color: 'black',
            backgroundColor: '#b8c0ca',
          }}
        >
          {intl.formatMessage({ id: 'registerBadge.next' })}
        </Button>
      </ButtonRow>
    </ContentWrapper>
  );
};
