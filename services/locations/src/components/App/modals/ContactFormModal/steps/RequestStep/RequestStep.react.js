import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, notification } from 'antd';

import { PrimaryButton, SecondaryButton } from 'components/general';

import { sendSupportMail } from 'network/api';

import {
  useOptionalPhoneValidator,
  useTextAreaValidator,
} from 'components/hooks/useValidators';
import { getFormattedPhoneNumber } from 'utils/parsePhoneNumber';

import {
  Wrapper,
  Text,
  ContactDataWrapper,
  Name,
  Value,
  ButtonWrapper,
  Title,
  StyledFormItem,
} from './RequestStep.styled';

export const RequestStep = ({ operator, next, closeModal }) => {
  const intl = useIntl();

  const phoneValidator = useOptionalPhoneValidator();
  const requestTextValidator = useTextAreaValidator('requestText', 3000);

  const contactData = [
    {
      intlId: 'contactForm.modal.supportCode',
      value: operator.supportCode,
      testId: 'contactFormOperatorSupportCode',
    },
    {
      intlId: 'contactForm.modal.name',
      value: `${operator.firstName} ${operator.lastName}`,
      testId: 'contactFormOperatorName',
    },
    {
      intlId: 'contactForm.modal.email',
      value: operator.email,
      testId: 'contactFormOperatorEmail',
    },
  ];

  const onFinish = values => {
    const { phone, requestText } = values;
    const formattedPhone = phone ? getFormattedPhoneNumber(phone) : undefined;
    const formattedRequestText = requestText?.split('\n').join(' ').trim();

    sendSupportMail({
      phone: formattedPhone,
      requestText: formattedRequestText,
    })
      .then(response => {
        if (response.status === 204) {
          next();
          return;
        }
        notification.error({
          message: intl.formatMessage({
            id: 'contactForm.modal.notification.error',
          }),
        });
      })
      .catch(() =>
        notification.error({
          message: intl.formatMessage({
            id: 'contactForm.modal.notification.error',
          }),
        })
      );
  };

  return (
    <Wrapper data-cy="contactFormModal">
      <Title>
        {intl.formatMessage({
          id: 'contactForm.modal.title',
        })}
      </Title>
      <Text>{intl.formatMessage({ id: 'contactForm.modal.text' })}</Text>
      {contactData.map(entry => (
        <ContactDataWrapper key={entry.intlId}>
          <Name>{`${intl.formatMessage({ id: entry.intlId })}:`}</Name>
          <Value data-cy={entry.testId}>{entry.value}</Value>
        </ContactDataWrapper>
      ))}
      <Form onFinish={onFinish}>
        <StyledFormItem
          colon={false}
          rules={phoneValidator}
          label={intl.formatMessage({
            id: 'contactForm.modal.phone',
          })}
          name="phone"
        >
          <Input data-cy="contactFormPhoneNumber" />
        </StyledFormItem>
        <Form.Item
          colon={false}
          label={intl.formatMessage({
            id: 'contactForm.modal.request',
          })}
          name="requestText"
          rules={requestTextValidator}
          required
        >
          <Input.TextArea
            maxLength={3000}
            showCount
            data-cy="contactFormMessage"
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>
        <ButtonWrapper multipleButtons>
          <SecondaryButton onClick={closeModal}>
            {intl.formatMessage({
              id: 'contactForm.modal.cancel',
            })}
          </SecondaryButton>
          <PrimaryButton htmlType="submit" data-cy="contactFormSendButton">
            {intl.formatMessage({
              id: 'contactForm.modal.submit',
            })}
          </PrimaryButton>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
};
