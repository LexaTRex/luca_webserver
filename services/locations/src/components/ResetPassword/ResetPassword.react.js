import React from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { Form, Input, notification, Alert, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { replace } from 'connected-react-router';
import { useParams } from 'react-router-dom';

import { passwordMeetsCriteria } from 'utils/passwordCheck';

// Assets
import LucaLogoWhite from 'assets/LucaLogoWhite.svg';

// Api
import { resetPassword, getPasswordResetRequest } from 'network/api';

// Constants
import { AUTHENTICATION_ROUTE } from 'constants/routes';

// Components
import {
  ForgotPasswordWrapper,
  ForgotPasswordCard,
  ButtonWrapper,
  Wrapper,
  Logo,
  SubTitle,
  HeaderWrapper,
  buttonStyle,
  Title,
} from '../ForgotPassword/ForgotPassword.styled';

const inputStyle = {
  border: '1px solid #696969',
  backgroundColor: 'transparent',
};

export const ResetPassword = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { requestId } = useParams();

  const title = intl.formatMessage({ id: 'resetPassword.site.title' });
  const meta = intl.formatMessage({ id: 'resetPassword.site.meta' });

  const {
    isLoading,
    error: requestError,
  } = useQuery(
    `passwordRequest/${requestId}`,
    () => getPasswordResetRequest(requestId),
    { cacheTime: 0, retry: 0 }
  );

  const onFinish = values => {
    const { newPassword } = values;

    resetPassword({ newPassword, resetId: requestId })
      .then(response => {
        if (response.status === 204) {
          notification.success({
            message: intl.formatMessage({
              id: 'notification.resetPassword.success',
            }),
          });
          dispatch(replace(AUTHENTICATION_ROUTE));
        } else {
          notification.error({
            message: intl.formatMessage({
              id: 'notification.resetPassword.error',
            }),
          });
        }
      })
      .catch(() =>
        notification.error({
          message: intl.formatMessage({
            id: 'notification.network.error',
          }),
        })
      );
  };

  if (isLoading) return null;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={meta} />
      </Helmet>

      <Wrapper>
        <HeaderWrapper>
          <Logo src={LucaLogoWhite} />
          <SubTitle>
            {intl.formatMessage({
              id: 'header.subtitle',
            })}
          </SubTitle>
        </HeaderWrapper>
        <ForgotPasswordWrapper>
          <ForgotPasswordCard>
            {requestError ? (
              <Alert
                message={intl.formatMessage({
                  id: 'resetPassword.error.expired',
                })}
                type="error"
              />
            ) : (
              <Form onFinish={onFinish}>
                <Title>
                  {intl.formatMessage({
                    id: 'resetPassword.title',
                  })}
                </Title>
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
                <ButtonWrapper>
                  <Button style={buttonStyle} htmlType="submit">
                    {intl.formatMessage({
                      id: 'resetPassword.form.button',
                    })}
                  </Button>
                </ButtonWrapper>
              </Form>
            )}
          </ForgotPasswordCard>
        </ForgotPasswordWrapper>
      </Wrapper>
    </>
  );
};
