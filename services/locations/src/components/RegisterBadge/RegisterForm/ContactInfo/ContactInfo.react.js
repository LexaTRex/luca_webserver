import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, notification } from 'antd';
import { PrimaryButton, SecondaryButton } from 'components/general';

import { requestTan } from 'network/api';

// hooks
import {
  usePhoneValidator,
  useEmailValidator,
} from 'components/hooks/useValidators';

import {
  ButtonRow,
  ContentTitle,
  ContentWrapper,
} from '../RegisterForm.styled';
import { PhoneValidationError } from './errors';

export const ContactInfo = ({
  title,
  back,
  requiresPhoneVerification,
  next,
  form,
  setValues,
}) => {
  const intl = useIntl();
  const phoneValidator = usePhoneValidator('phone');
  const emailValidator = useEmailValidator();

  function validateResponse(response) {
    if (
      response.errors &&
      response.errors.some(error => (error.path ?? [''])[0] === 'phone')
    ) {
      throw new PhoneValidationError();
    }
    if (!response.challengeId) throw new Error('missing challengeId');
  }

  const requestTanForUser = async values => {
    try {
      const response = await requestTan({ phone: values.phone });
      validateResponse(response);
      const { challengeId } = response;
      const finalValues = { ...values, challengeId };
      setValues(finalValues);
      next();
    } catch (error) {
      const id =
        error instanceof PhoneValidationError
          ? 'error.phone.valid'
          : 'notification.sendTan.error';
      notification.error({
        message: intl.formatMessage({
          id,
        }),
      });
    }
  };

  const handleNext = () => {
    form.current
      .validateFields()
      .then(requestTanForUser)
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'error.registerBadge.invalidContactInfo',
          }),
        });
      });
  };

  const renderPhoneItem = () => {
    if (requiresPhoneVerification) {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form.Item
            style={{ flexBasis: '60%' }}
            rules={phoneValidator}
            label={intl.formatMessage({
              id: 'registerBadge.phone',
            })}
            name="phone"
          >
            <Input />
          </Form.Item>
        </div>
      );
    }
    return (
      <Form.Item
        rules={phoneValidator}
        label={intl.formatMessage({
          id: 'registerBadge.phone',
        })}
        name="phone"
      >
        <Input />
      </Form.Item>
    );
  };

  return (
    <ContentWrapper>
      <ContentTitle>{title}</ContentTitle>
      {renderPhoneItem()}
      <Form.Item
        rules={emailValidator}
        label={intl.formatMessage({
          id: 'registerBadge.email',
        })}
        name="email"
      >
        <Input />
      </Form.Item>

      <ButtonRow multipleButtons>
        <SecondaryButton onClick={back}>
          {intl.formatMessage({ id: 'registerBadge.back' })}
        </SecondaryButton>
        {requiresPhoneVerification ? (
          <PrimaryButton onClick={handleNext}>
            {intl.formatMessage({ id: 'registerBadge.next' })}
          </PrimaryButton>
        ) : (
          <PrimaryButton htmlType="submit">
            {intl.formatMessage({ id: 'registerBadge.next' })}
          </PrimaryButton>
        )}
      </ButtonRow>
    </ContentWrapper>
  );
};
