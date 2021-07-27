import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input } from 'antd';
import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';

// hooks
import { usePhoneValidator } from 'components/hooks/useValidators';
import { getFormattedPhoneNumber } from 'utils/parsePhoneNumber';

import {
  Wrapper,
  Header,
  Description,
  ButtonWrapper,
} from '../../../generalOnboarding/Onboarding.styled';

export const PhoneInput = ({ phone: currentPhone, setPhone, back, next }) => {
  const intl = useIntl();
  const phoneValidator = usePhoneValidator('phone');

  const onFinish = ({ phone }) => {
    setPhone(getFormattedPhoneNumber(phone));
    next();
  };

  return (
    <Wrapper>
      <Header>
        {intl.formatMessage({
          id: `modal.createGroup.phoneInput.title`,
        })}
      </Header>
      <Description>
        {intl.formatMessage({
          id: `modal.createGroup.phoneInput.description`,
        })}
      </Description>
      <Form
        onFinish={onFinish}
        initialValues={currentPhone ? { phone: currentPhone } : {}}
      >
        <Form.Item
          colon={false}
          label={intl.formatMessage({
            id: 'createGroup.phone',
          })}
          name="phone"
          rules={phoneValidator}
        >
          <Input autoFocus />
        </Form.Item>
        <ButtonWrapper multipleButtons>
          <SecondaryButton onClick={back}>
            {intl.formatMessage({
              id: 'authentication.form.button.back',
            })}
          </SecondaryButton>
          <PrimaryButton htmlType="submit">
            {intl.formatMessage({
              id: 'authentication.form.button.next',
            })}
          </PrimaryButton>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
};
