import React from 'react';
import { useIntl } from 'react-intl';
import { getSormasClient } from 'network/sormas';
import { Form, Input, notification } from 'antd';
import { PrimaryButton } from 'components/general';

import { ButtonWrapper } from '../SormasModal.styled';

import { Headline } from './Credentials.styled';
import { getConnectionFields } from './CredentialsStep.helper';

export function CredentialsStep({ onFinish }) {
  const intl = useIntl();

  const onConnect = async ({ host, username, password }) => {
    try {
      const client = getSormasClient(new URL(host).host, username, password);
      const isValidVersion = await client.checkVersion();
      if (!isValidVersion) {
        notification.open({
          type: 'error',
          message: intl.formatMessage({
            id: 'modal.sormas.credentialstep.versionFailure',
          }),
        });
        return;
      }

      notification.open({
        type: 'success',
        message: intl.formatMessage({
          id: 'modal.sormas.credentialstep.connectSuccess',
        }),
      });
      onFinish({ host: new URL(host).host, username, password });
    } catch {
      notification.open({
        type: 'error',
        message: intl.formatMessage({
          id: 'modal.sormas.credentialstep.connectFailure',
        }),
      });
    }
  };

  return (
    <Form onFinish={onConnect}>
      <Headline>
        {intl.formatMessage({
          id: 'modal.sormas.credentialstep.connect.header',
        })}
      </Headline>
      {getConnectionFields(intl).map(field => (
        <Form.Item key={field.name} name={field.name} rules={field.rules}>
          <Input
            type={field.type}
            placeholder={field.placeholder}
            autoFocus={field.autoFocus || false}
          />
        </Form.Item>
      ))}
      <ButtonWrapper>
        <Form.Item>
          <PrimaryButton htmlType="submit">
            {intl.formatMessage({
              id: 'modal.sormas.credentialstep.connect',
            })}
          </PrimaryButton>
        </Form.Item>
      </ButtonWrapper>
    </Form>
  );
}
