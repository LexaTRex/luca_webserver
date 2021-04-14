import React from 'react';
import { useIntl } from 'react-intl';
import { Input, Button, Form, notification } from 'antd';

// API
import { verifyTan } from 'network/api';

import {
  ContentWrapper,
  ContentTitle,
  ButtonRow,
} from '../RegisterForm.styled';

export const TanVerification = ({ title, back, challengeId, form, next }) => {
  const intl = useIntl();

  const verifyTanForUser = tan =>
    verifyTan({ challengeId, tan })
      .then(() => {
        next();
      })
      .catch(() =>
        notification.error({
          message: intl.formatMessage({
            id: 'notification.verifyTan.error',
          }),
        })
      );

  const handleNext = () => {
    form.current
      .validateFields()
      .then(values => {
        verifyTanForUser(values.tan);
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'error.registerBadge.invalidTanVerification',
          }),
        });
      });
  };

  return (
    <ContentWrapper>
      <ContentTitle>{title}</ContentTitle>
      <Form.Item
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'error.tan',
            }),
          },
        ]}
        label={intl.formatMessage({
          id: 'registerBadge.tan',
        })}
        name="tan"
      >
        <Input />
      </Form.Item>

      <ButtonRow multipleButtons>
        <Button
          onClick={back}
          style={{
            color: 'black',
            border: '1px solid #b8c0ca',
          }}
        >
          {intl.formatMessage({ id: 'registerBadge.back' })}
        </Button>
        <Button
          onClick={handleNext}
          style={{
            color: 'black',
            backgroundColor: '#b8c0ca',
          }}
        >
          {intl.formatMessage({ id: 'registerBadge.next' })}
        </Button>
      </ButtonRow>
    </ContentWrapper>
  );
};
