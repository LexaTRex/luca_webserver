import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, Button } from 'antd';

import { getFormattedPhoneNumber } from 'utils/parsePhoneNumber';
import { getPhoneRules } from 'utils/validatorRules';

import {
  nextButtonStyles,
  backButtonStyles,
  Wrapper,
  Header,
  Description,
  ButtonWrapper,
} from '../../../generalOnboarding/Onboarding.styled';

export const PhoneInput = ({ phone: currentPhone, setPhone, back, next }) => {
  const intl = useIntl();

  const onFinish = ({ phone }) => {
    setPhone(getFormattedPhoneNumber(phone));
    next();
  };

  return (
    <Wrapper>
      <Header>
        {intl.formatMessage({
          id: 'modal.createLocation.phoneInput.title',
        })}
      </Header>
      <Description>
        {intl.formatMessage({
          id: 'modal.createLocation.phoneInput.description',
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
          rules={[getPhoneRules(intl)]}
        >
          <Input autoFocus />
        </Form.Item>
        <ButtonWrapper multipleButtons>
          <Button
            onClick={back}
            data-cy="previousStep"
            style={backButtonStyles}
          >
            {intl.formatMessage({
              id: 'authentication.form.button.back',
            })}
          </Button>
          <Button data-cy="nextStep" style={nextButtonStyles} htmlType="submit">
            {intl.formatMessage({
              id: 'authentication.form.button.next',
            })}
          </Button>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
};
