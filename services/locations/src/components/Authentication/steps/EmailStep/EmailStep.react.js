import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, Button, notification } from 'antd';

import { checkEmail } from 'network/api';

import {
  nextButtonStyles,
  CardTitle,
  ButtonWrapper,
} from 'components/Authentication/Authentication.styled';

export const EmailStep = ({
  email: currentEmail,
  setEmail,
  setIsRegistration,
  next,
}) => {
  const intl = useIntl();

  const onFinish = values => {
    const { email } = values;
    checkEmail(email.toLowerCase())
      .then(response => {
        if (response.status === 429) {
          // Too many requests
          notification.error({
            message: intl.formatMessage({
              id: 'registration.server.error.tooManyRequests.title',
            }),
            description: intl.formatMessage({
              id: 'registration.server.error.tooManyRequests.desc',
            }),
          });
          return;
        }
        if (response.status >= 500) {
          // Server erros
          notification.error({
            message: intl.formatMessage({
              id: 'registration.server.error.msg',
            }),
            description: intl.formatMessage({
              id: 'registration.server.error.desc',
            }),
          });
          return;
        }
        if (response.status === 200) {
          // Email exists
          setEmail(email.toLowerCase());
          next();
          return;
        }
        // Email does not exist
        setEmail(email.toLowerCase());
        setIsRegistration(true);
        next();
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'registration.server.error.msg',
          }),
          description: intl.formatMessage({
            id: 'registration.server.error.desc',
          }),
        });
      });
  };

  return (
    <>
      <CardTitle data-cy="loginPage">
        {intl.formatMessage({
          id: 'authentication.loginRegister.title',
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
          rules={[
            {
              type: 'email',
              message: intl.formatMessage({
                id: 'error.email',
              }),
            },
            {
              required: true,
              message: intl.formatMessage({
                id: 'error.email',
              }),
            },
          ]}
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

        <ButtonWrapper>
          <Button style={nextButtonStyles} htmlType="submit">
            {intl.formatMessage({
              id: 'authentication.form.button.next',
            })}
          </Button>
        </ButtonWrapper>
      </Form>
    </>
  );
};
