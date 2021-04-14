import React from 'react';
import { useIntl } from 'react-intl';
import { Input, Button, Form, notification } from 'antd';

import { requestTan } from 'network/api';

import {
  ContentWrapper,
  ContentTitle,
  ButtonRow,
} from '../RegisterForm.styled';

export const ContactInfo = ({
  title,
  back,
  requiresPhoneVerification,
  next,
  form,
  setValues,
}) => {
  const intl = useIntl();

  const requestTanForUser = values =>
    requestTan({ phone: values.phone })
      .then(response => {
        const { challengeId } = response;
        const finalValues = { ...values, challengeId };
        setValues(finalValues);
        next();
      })
      .catch(() =>
        notification.error({
          message: intl.formatMessage({
            id: 'notification.sendTan.error',
          }),
        })
      );

  const handleNext = () => {
    form.current
      .validateFields()
      .then(values => {
        requestTanForUser(values);
      })
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
              {
                required: true,
                message: intl.formatMessage({
                  id: 'error.phone',
                }),
              },
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
          {
            required: true,
            message: intl.formatMessage({
              id: 'error.phone',
            }),
          },
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
