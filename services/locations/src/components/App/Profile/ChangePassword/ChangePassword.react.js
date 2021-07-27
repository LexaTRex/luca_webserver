import React from 'react';
import { useIntl } from 'react-intl';
import { Input, Form, notification } from 'antd';
import { PrimaryButton } from 'components/general/Buttons.styled';
import { changePassword } from 'network/api';
import { passwordMeetsCriteria } from 'utils/passwordCheck';

import { handleResponse } from './ChangePassword.helper';
import {
  ProfileContent,
  Heading,
  Overview,
  ButtonWrapper,
} from './ChangePassword.styled';

export const ChangePassword = () => {
  const intl = useIntl();
  const [form] = Form.useForm();

  const onFinish = values => {
    const { currentPassword, newPassword } = values;

    changePassword({
      data: { currentPassword, newPassword, lang: intl.locale },
    })
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

  const submitForm = () => {
    form.submit();
  };

  return (
    <ProfileContent>
      <Overview>
        <Heading>
          {intl.formatMessage({ id: 'profile.changePassword' })}
        </Heading>
        <Form
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          style={{ maxWidth: 350 }}
        >
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
            <Input.Password />
          </Form.Item>
          <Form.Item
            colon={false}
            name="newPassword"
            hasFeedback
            label={intl.formatMessage({
              id: 'profile.changePassword.newPassword',
            })}
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
            <Input.Password />
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
            <Input.Password />
          </Form.Item>
        </Form>
        <ButtonWrapper>
          <PrimaryButton data-cy="changePassword" onClick={submitForm}>
            {intl.formatMessage({ id: 'profile.overview.submit' })}
          </PrimaryButton>
        </ButtonWrapper>
      </Overview>
    </ProfileContent>
  );
};
