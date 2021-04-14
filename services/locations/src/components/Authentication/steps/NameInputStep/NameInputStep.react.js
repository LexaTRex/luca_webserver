import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, Button } from 'antd';

import {
  backButtonStyles,
  nextButtonStyles,
  CardTitle,
  ButtonWrapper,
  Step,
} from 'components/Authentication/Authentication.styled';

const inputStyle = {
  border: '1px solid #696969',
  backgroundColor: 'transparent',
};

export const NameInputStep = ({ name, setName, next, back, navigation }) => {
  const intl = useIntl();

  const onFinish = values => {
    const { firstName, lastName } = values;
    setName({ firstName, lastName });
    next();
  };

  return (
    <>
      <Step>{navigation}</Step>
      <CardTitle>
        {intl.formatMessage({
          id: 'authentication.nameInput.title',
        })}
      </CardTitle>
      <Form
        onFinish={onFinish}
        initialValues={
          name ? { firstName: name.firstName, lastName: name.lastName } : {}
        }
      >
        <Form.Item
          colon={false}
          name="firstName"
          label={intl.formatMessage({
            id: 'generic.firstName',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'error.firstName',
              }),
            },
          ]}
        >
          <Input style={inputStyle} autoFocus />
        </Form.Item>
        <Form.Item
          colon={false}
          name="lastName"
          label={intl.formatMessage({
            id: 'generic.lastName',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'error.lastName',
              }),
            },
          ]}
        >
          <Input style={inputStyle} />
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
    </>
  );
};
