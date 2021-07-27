import React from 'react';
import { useIntl } from 'react-intl';
import { Input, Form, notification } from 'antd';
import { PrimaryButton } from 'components/general';

import { usePersonNameValidator } from 'components/hooks/useValidators';

import {
  ContentTitle,
  ContentWrapper,
  ButtonRow,
} from '../RegisterForm.styled';

export const NameInfo = ({ title, next, form, setValues }) => {
  const intl = useIntl();
  const firstNameValidator = usePersonNameValidator('firstName');
  const lastNameValidator = usePersonNameValidator('lastName');

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
        rules={firstNameValidator}
        label={intl.formatMessage({
          id: 'generic.firstName',
        })}
        name="firstName"
      >
        <Input />
      </Form.Item>
      <Form.Item
        rules={lastNameValidator}
        label={intl.formatMessage({
          id: 'generic.lastName',
        })}
        name="lastName"
      >
        <Input />
      </Form.Item>
      <ButtonRow>
        <PrimaryButton onClick={handleNext}>
          {intl.formatMessage({ id: 'registerBadge.next' })}
        </PrimaryButton>
      </ButtonRow>
    </ContentWrapper>
  );
};
