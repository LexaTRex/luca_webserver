import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input } from 'antd';

import { usePersonNameValidator } from 'components/hooks/useValidators';

import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';

import {
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
  const firstNameValidator = usePersonNameValidator('firstName');
  const lastNameValidator = usePersonNameValidator('lastName');

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
          data-cy="registerFirstName"
          colon={false}
          name="firstName"
          label={intl.formatMessage({
            id: 'generic.firstName',
          })}
          rules={firstNameValidator}
        >
          <Input style={inputStyle} autoFocus />
        </Form.Item>
        <Form.Item
          data-cy="registerLastName"
          colon={false}
          name="lastName"
          label={intl.formatMessage({
            id: 'generic.lastName',
          })}
          rules={lastNameValidator}
        >
          <Input style={inputStyle} />
        </Form.Item>

        <ButtonWrapper multipleButtons>
          <SecondaryButton onClick={back}>
            {intl.formatMessage({
              id: 'authentication.form.button.back',
            })}
          </SecondaryButton>
          <PrimaryButton
            $isButtonWhite
            htmlType="submit"
            data-cy="confirmNameButton"
          >
            {intl.formatMessage({
              id: 'authentication.form.button.next',
            })}
          </PrimaryButton>
        </ButtonWrapper>
      </Form>
    </>
  );
};
