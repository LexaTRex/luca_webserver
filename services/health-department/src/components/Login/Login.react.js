import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Form, Input } from 'antd';
import { PrimaryButton } from 'components/general';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

// Assets
import LucaLogo from 'assets/LucaLogo.svg';
import Login1 from 'assets/Login1.jpg';

// Api
import { login } from 'network/api';

// Constants
import { APP_ROUTE } from 'constants/routes';

// Components
import { Footer } from './Footer';
import {
  LoginWrapper,
  LoginCard,
  ButtonWrapper,
  Left,
  Right,
  Wrapper,
  Logo,
  SubTitle,
  HeaderWrapper,
  ErrorMessage,
  VersionFooterWrapper,
} from './Login.styled';
import { clearPrivateKeys } from '../../utils/cryptoKeyOperations';

export const Login = () => {
  const intl = useIntl();
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const title = intl.formatMessage({ id: 'main.site.title' });
  const meta = intl.formatMessage({ id: 'main.site.meta' });

  const onFinish = values => {
    clearPrivateKeys();

    login(values)
      .then(response => {
        if (response.status === 502) {
          setError('login.error.server.down');
          return;
        }
        if (response.status !== 200) {
          setError('login.error');
          return;
        }
        setError(false);
        dispatch(push(`${APP_ROUTE}${window.location.search}`));
      })
      .catch(loginError => console.error(loginError));
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={meta} />
      </Helmet>
      <Wrapper>
        <Left>
          <HeaderWrapper>
            <Logo src={LucaLogo} />
            <SubTitle>
              {intl.formatMessage({
                id: 'header.subtitle',
              })}
            </SubTitle>
          </HeaderWrapper>
          <VersionFooterWrapper>
            <Footer />
          </VersionFooterWrapper>
        </Left>
        <Right src={Login1} />
        <LoginWrapper>
          <LoginCard>
            <Form onFinish={onFinish}>
              <Form.Item
                colon={false}
                label={intl.formatMessage({
                  id: 'login.form.email',
                })}
                name="username"
              >
                <Input
                  autoComplete="username"
                  style={{
                    border: '1px solid #696969',
                    backgroundColor: 'transparent',
                  }}
                />
              </Form.Item>
              <Form.Item
                colon={false}
                label={intl.formatMessage({
                  id: 'login.form.password',
                })}
                name="password"
              >
                <Input.Password
                  autoComplete="current-password"
                  iconRender={visible =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  style={{
                    border: '1px solid #696969',
                    backgroundColor: 'transparent',
                  }}
                />
              </Form.Item>
              {error && (
                <ErrorMessage>
                  {intl.formatMessage({
                    id: error,
                  })}
                </ErrorMessage>
              )}
              <ButtonWrapper>
                <Form.Item
                  style={{
                    marginBottom: 0,
                    marginTop: 24,
                  }}
                >
                  <PrimaryButton
                    htmlType="submit"
                    $isButtonWhite
                    style={{
                      marginTop: '24px',
                    }}
                  >
                    {intl.formatMessage({
                      id: 'login.form.button',
                    })}
                  </PrimaryButton>
                </Form.Item>
              </ButtonWrapper>
            </Form>
          </LoginCard>
        </LoginWrapper>
      </Wrapper>
    </>
  );
};
