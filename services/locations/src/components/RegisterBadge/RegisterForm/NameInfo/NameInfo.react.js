import React from 'react';
import { useIntl } from 'react-intl';
import { Input, Button, Form, notification } from 'antd';

import { MAX_NAME_LENGTH } from 'constants/valueLength';

import {
  ContentTitle,
  ContentWrapper,
  ButtonRow,
} from '../RegisterForm.styled';

export const NameInfo = ({ title, next, form, setValues }) => {
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
            id: 'error.registerBadge.invalidNameInfo',
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
              id: 'error.firstName',
            }),
          },
          {
            max: MAX_NAME_LENGTH,
            message: intl.formatMessage({
              id: 'error.length',
            }),
          },
        ]}
        label={intl.formatMessage({
          id: 'generic.firstName',
        })}
        name="firstName"
      >
        <Input />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'error.lastName',
            }),
          },
          {
            max: MAX_NAME_LENGTH,
            message: intl.formatMessage({
              id: 'error.length',
            }),
          },
        ]}
        label={intl.formatMessage({
          id: 'generic.lastName',
        })}
        name="lastName"
      >
        <Input />
      </Form.Item>
      <ButtonRow>
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
