import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { Form, Input, notification } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

import { useEmailValidator } from 'components/hooks/useValidators';

// Api
import { login } from 'network/api';

// Constants
import { BASE_GROUP_ROUTE } from 'constants/routes';

// Utils
import { usePrivateKey } from 'utils/privateKey';
import { clearHasSeenPrivateKeyModal } from 'utils/storage';

import { ForgotPasswordLink } from './ForgotPasswordLink';
import { LoginError } from './LoginError';
import { LoginActions } from './LoginActions';

import { AuthenticationCard, CardTitle } from '../../Authentication.styled';

export const LoginCard = () => {
  const intl = useIntl();
  const [, clearPrivateKey] = usePrivateKey(null);
  const [error, setError] = useState(null);
  const history = useHistory();
  const emailValidator = useEmailValidator();

  const handleLoginErrors = response => {
    if (response.status === 429) {
      setError({
        message: 'registration.server.error.tooManyRequests.title',
      });
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
    if (response.status === 423) {
      setError({
        message: 'registration.server.error.notActivated.title',
      });
      // Not activated
      notification.error({
        message: intl.formatMessage({
          id: 'registration.server.error.notActivated.title',
        }),
        description: intl.formatMessage({
          id: 'registration.server.error.notActivated.desc',
        }),
      });
      return;
    }
    setError({
      message: 'login.error',
    });
    notification.error({
      message: intl.formatMessage({
        id: 'notification.login.error',
      }),
    });
  };

  const onFinish = values => {
    const { email, password } = values;
    login({ username: email, password })
      .then(response => {
        if (response.status !== 200) {
          handleLoginErrors(response);
          return;
        }
        setError(null);
        clearPrivateKey(null);
        clearHasSeenPrivateKeyModal();
        history.push(BASE_GROUP_ROUTE);
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
    <AuthenticationCard>
      <CardTitle data-cy="loginPage">
        {intl.formatMessage({
          id: 'loginCard.title',
        })}
      </CardTitle>
      <Form onFinish={onFinish}>
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
        <Form.Item
          colon={false}
          label={intl.formatMessage({
            id: 'registration.form.password',
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
        <LoginError error={error} />
        <ForgotPasswordLink />
        <LoginActions />
      </Form>
    </AuthenticationCard>
  );
};
