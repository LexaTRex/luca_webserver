import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, Button } from 'antd';

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

  const onFinish = values => {
    const { phone } = values;
    setPhone(phone);
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
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'error.phone',
              }),
            },
          ]}
        >
          <Input autoFocus />
        </Form.Item>
        <ButtonWrapper multipleButtons>
          <Button style={backButtonStyles} onClick={back}>
            {intl.formatMessage({
              id: 'authentication.form.button.back',
            })}
          </Button>
          <Button style={nextButtonStyles} htmlType="submit">
            {intl.formatMessage({
              id: 'authentication.form.button.next',
            })}
          </Button>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
};
