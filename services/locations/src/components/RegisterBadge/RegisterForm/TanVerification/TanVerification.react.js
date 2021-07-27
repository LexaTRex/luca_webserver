import React from 'react';
import { useIntl } from 'react-intl';
import { Input, Form, notification } from 'antd';
import { PrimaryButton, SecondaryButton } from 'components/general';

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
        <SecondaryButton onClick={back}>
          {intl.formatMessage({ id: 'registerBadge.back' })}
        </SecondaryButton>
        <PrimaryButton onClick={handleNext}>
          {intl.formatMessage({ id: 'registerBadge.next' })}
        </PrimaryButton>
      </ButtonRow>
    </ContentWrapper>
  );
};
