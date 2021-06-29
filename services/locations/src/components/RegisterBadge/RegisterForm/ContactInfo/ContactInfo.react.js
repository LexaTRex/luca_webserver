import React from 'react';
import { useIntl } from 'react-intl';
import { Button, Form, Input, notification } from 'antd';

import { requestTan } from 'network/api';

import { requiresPhone, invalidPhone } from 'constants/errorMessages';
import {
  getRequiredRule,
  getPhoneRules,
  getMaxLengthRule,
} from 'utils/validatorRules';
import { MAX_EMAIL_LENGTH, MAX_PHONE_LENGTH } from 'constants/valueLength';

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
            rules={[
              getRequiredRule(intl, requiresPhone),
              getPhoneRules(intl, invalidPhone),
              getMaxLengthRule(intl, MAX_PHONE_LENGTH),
            ]}
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
        rules={[
          getRequiredRule(intl, requiresPhone),
          getPhoneRules(intl, invalidPhone),
          getMaxLengthRule(intl, MAX_PHONE_LENGTH),
        ]}
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
        rules={[
          {
            type: 'email',
            message: intl.formatMessage({
              id: 'error.email',
            }),
          },
          getMaxLengthRule(intl, MAX_EMAIL_LENGTH),
        ]}
        label={intl.formatMessage({
          id: 'registerBadge.email',
        })}
        name="email"
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
        {requiresPhoneVerification ? (
          <Button
            onClick={handleNext}
            style={{
              color: 'black',
              backgroundColor: '#b8c0ca',
            }}
          >
            {intl.formatMessage({ id: 'registerBadge.next' })}
          </Button>
        ) : (
          <Button
            htmlType="submit"
            style={{
              color: 'black',
              backgroundColor: '#b8c0ca',
            }}
          >
            {intl.formatMessage({ id: 'registerBadge.next' })}
          </Button>
        )}
      </ButtonRow>
    </ContentWrapper>
  );
};
