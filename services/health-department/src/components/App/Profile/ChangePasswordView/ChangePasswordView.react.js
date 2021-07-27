import React from 'react';
import { useIntl } from 'react-intl';
import { Input, Button, Form, notification } from 'antd';
import { changePassword } from 'network/api';
import { passwordMeetsCriteria } from 'utils/passwordCheck';
import { handleResponse } from './ChangePasswordView.helper';
import {
  Wrapper,
  StyledHeadline,
  buttonStyle,
} from './ChangePasswordView.styled';
import { inputStyle, StyledButtonRow } from '../Profile.styled';

export const ChangePasswordView = () => {
  const intl = useIntl();
  const [form] = Form.useForm();

  const onFinish = values => {
    const { currentPassword, newPassword } = values;

    changePassword({ currentPassword, newPassword, lang: intl.locale })
      .then(response => {
        handleResponse(response, intl, form);
      })
      .catch(() =>
        notification.error({
          message: intl.formatMessage({
            id: 'registration.server.error.msg',
          }),
          description: intl.formatMessage({
            id: 'registration.server.error.desc',
          }),
        })
      );
  };

  return (
    <Wrapper>
      <StyledHeadline>
        {intl.formatMessage({ id: 'profile.changePassword' })}
      </StyledHeadline>
      <Form form={form} onFinish={onFinish} autoComplete="off">
        <Form.Item
          colon={false}
          name="currentPassword"
          label={intl.formatMessage({
            id: 'profile.changePassword.oldPassword',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'error.password',
              }),
            },
          ]}
        >
          <Input.Password style={inputStyle} />
        </Form.Item>
        <Form.Item
          colon={false}
          name="newPassword"
          label={intl.formatMessage({
            id: 'profile.changePassword.newPassword',
          })}
          hasFeedback
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'error.password',
              }),
            },
            () => ({
              validator(rule, value) {
                if (passwordMeetsCriteria(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  intl.formatMessage({
                    id: 'error.password.simple',
                  })
                );
              },
            }),
          ]}
        >
          <Input.Password style={inputStyle} />
        </Form.Item>
        <Form.Item
          colon={false}
          name="newPasswordConfirm"
          label={intl.formatMessage({
            id: 'profile.changePassword.newPasswordRepeat',
          })}
          hasFeedback
          dependencies={['newPassword']}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'error.passwordConfirm',
              }),
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  intl.formatMessage({
                    id: 'error.passwordConfirm',
                  })
                );
              },
            }),
          ]}
        >
          <Input.Password style={inputStyle} />
        </Form.Item>
        <StyledButtonRow>
          <Form.Item>
            <Button htmlType="submit" style={buttonStyle}>
              {intl.formatMessage({
                id: 'profile.changePassword',
              })}
            </Button>
          </Form.Item>
        </StyledButtonRow>
      </Form>
    </Wrapper>
  );
};
