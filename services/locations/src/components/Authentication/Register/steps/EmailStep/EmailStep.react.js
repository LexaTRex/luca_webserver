import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, notification } from 'antd';
import { PrimaryButton } from 'components/general/Buttons.styled';

import { checkEmail } from 'network/api';

import { useEmailValidator } from 'components/hooks/useValidators';

import {
  CardTitle,
  ButtonWrapper,
} from 'components/Authentication/Authentication.styled';

import { ErrorMessage } from './ErrorMessage';

export const EmailStep = ({ email: currentEmail, setEmail, next }) => {
  const intl = useIntl();
  const [emailExists, setEmailExists] = useState(false);
  const emailValidator = useEmailValidator();

  const onFinish = values => {
    const { email } = values;
    setEmail(email);
    checkEmail(email)
      .then(() => {
        // Email exists
        setEmailExists(true);
      })
      .catch(error => {
        switch (error.status) {
          case 404:
            // email does not exist proceed registration
            setEmail(email);
            next();
            break;
          case 429:
            // Too many requests
            notification.error({
              message: intl.formatMessage({
                id: 'registration.server.error.tooManyRequests.title',
              }),
              description: intl.formatMessage({
                id: 'registration.server.error.tooManyRequests.desc',
              }),
            });
            break;
          default:
            notification.error({
              message: intl.formatMessage({
                id: 'registration.server.error.msg',
              }),
              description: intl.formatMessage({
                id: 'registration.server.error.desc',
              }),
            });
        }
      });
  };

  return (
    <>
      <CardTitle data-cy="loginPage">
        {intl.formatMessage({
          id: 'authentication.register.title',
        })}
      </CardTitle>
      <Form
        onFinish={onFinish}
        initialValues={currentEmail ? { email: currentEmail } : {}}
      >
        <Form.Item
          colon={false}
          label={intl.formatMessage({
            id: 'registration.form.email',
          })}
          name="email"
          rules={emailValidator}
        >
          <Input
            autoFocus
            autoComplete="username"
            style={{
              border: '1px solid #696969',
              backgroundColor: 'transparent',
            }}
          />
        </Form.Item>
        <ErrorMessage emailExists={emailExists} />
        <ButtonWrapper>
          <PrimaryButton
            $isButtonWhite
            htmlType="submit"
            data-cy="createNewAccountButton"
          >
            {intl.formatMessage({
              id: 'authentication.form.button.next',
            })}
          </PrimaryButton>
        </ButtonWrapper>
      </Form>
    </>
  );
};
