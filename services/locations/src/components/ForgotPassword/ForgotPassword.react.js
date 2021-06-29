import React from 'react';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { Button, Form, Input, notification } from 'antd';
import { useHistory } from 'react-router';

import LucaLogoWhite from 'assets/LucaLogoWhite.svg';

import { forgotPassword } from 'network/api';

import { AUTHENTICATION_ROUTE } from 'constants/routes';

import {
  buttonStyle,
  ButtonWrapper,
  ForgotPasswordCard,
  ForgotPasswordWrapper,
  HeaderWrapper,
  Link,
  LinkWrapper,
  Logo,
  SubTitle,
  Title,
  Wrapper,
} from './ForgotPassword.styled';
import { messageForResponse } from './ForgotPassword.helper';

export const ForgotPassword = ({ location }) => {
  const intl = useIntl();

  const title = intl.formatMessage({ id: 'forgotPassword.site.title' });
  const meta = intl.formatMessage({ id: 'forgotPassword.site.meta' });
  const history = useHistory();
  const { email } = location;

  const onFinish = values => {
    forgotPassword({ email: values.email, lang: intl.locale })
      .then(({ status }) => {
        const { message, route } = messageForResponse(status);

        if (status === 204) {
          notification.success({
            message: intl.formatMessage({ id: message }),
          });
        } else if (status === 404 || status === 423) {
          notification.warning({
            message: intl.formatMessage({ id: message }),
          });
        } else {
          notification.error({
            message: intl.formatMessage({ id: message }, { error: status }),
          });
        }

        history.push(route);
      })
      .catch(error => {
        notification.error({
          message: intl.formatMessage(
            { id: 'notification.network.error' },
            { error }
          ),
        });
      });
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={meta} />
      </Helmet>
      <Wrapper data-cy="forgotPasswordPage">
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
            <Title>
              {intl.formatMessage({
                id: 'forgotPassword.title',
              })}
            </Title>
            <Form onFinish={onFinish} initialValues={{ email }}>
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
                  autoComplete="username"
                  style={{
                    border: '1px solid #696969',
                    backgroundColor: 'transparent',
                  }}
                />
              </Form.Item>
              <ButtonWrapper>
                <Button
                  style={buttonStyle}
                  htmlType="submit"
                  data-cy="sentResetLinkSubmit"
                >
                  {intl.formatMessage({
                    id: 'forgotPassword.form.button',
                  })}
                </Button>
              </ButtonWrapper>
            </Form>
            <LinkWrapper>
              <Link href={AUTHENTICATION_ROUTE}>
                {intl.formatMessage({
                  id: 'forgotPassword.loginLink',
                })}
              </Link>
            </LinkWrapper>
          </ForgotPasswordCard>
        </ForgotPasswordWrapper>
      </Wrapper>
    </>
  );
};
