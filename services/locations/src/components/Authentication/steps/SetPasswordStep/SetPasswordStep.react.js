import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, Button } from 'antd';
import { MinusOutlined, CheckOutlined } from '@ant-design/icons';

import { IS_MOBILE } from 'constants/environment';

import {
  passwordMeetsCriteria,
  hasSufficientLength,
  hasNumber,
  hasLowerCase,
  hasUpperCase,
  hasSpecialCharacter,
} from 'utils/passwordCheck';

import {
  backButtonStyles,
  nextButtonStyles,
  CardTitle,
  CardSubTitle,
  ButtonWrapper,
  Step,
} from 'components/Authentication/Authentication.styled';

import { Criteria, CriteriaIcon, CriteriaText } from './SetPasswordStep.styled';

const inputStyle = {
  border: '1px solid #696969',
  backgroundColor: 'transparent',
};

export const SetPasswordStep = ({
  currentPassword,
  setPassword,
  next,
  back,
  navigation,
}) => {
  const intl = useIntl();
  const [criteriaCheck, setCriteriaCheck] = useState({
    length: false,
    number: false,
    upperCase: false,
    lowerCase: false,
    specialChar: false,
  });

  const onFinish = values => {
    setPassword(values.password);
    next();
  };

  const onChange = values => {
    const { password } = values;
    if (!password) return;
    setCriteriaCheck({
      length: hasSufficientLength(password),
      number: hasNumber(password),
      upperCase: hasUpperCase(password),
      lowerCase: hasLowerCase(password),
      specialChar: hasSpecialCharacter(password),
    });
  };

  const criterias = [
    {
      type: 'length',
      intl: intl.formatMessage({
        id: 'authentication.setPassword.criteria.length',
      }),
      ok: criteriaCheck.length,
    },
    {
      type: 'number',
      intl: intl.formatMessage({
        id: 'authentication.setPassword.criteria.number',
      }),
      ok: criteriaCheck.number,
    },
    {
      type: 'upperCase',
      intl: intl.formatMessage({
        id: 'authentication.setPassword.criteria.upperCase',
      }),
      ok: criteriaCheck.upperCase,
    },
    {
      type: 'lowerCase',
      intl: intl.formatMessage({
        id: 'authentication.setPassword.criteria.lowerCase',
      }),
      ok: criteriaCheck.lowerCase,
    },
    {
      type: 'specialChar',
      intl: intl.formatMessage({
        id: 'authentication.setPassword.criteria.specialChar',
      }),
      ok: criteriaCheck.specialChar,
    },
  ];

  return (
    <>
      <Step>{navigation}</Step>
      <CardTitle data-cy="setPassword">
        {intl.formatMessage({
          id: 'authentication.setPassword.title',
        })}
      </CardTitle>
      <CardSubTitle>
        {intl.formatMessage({
          id: 'authentication.setPassword.subTitle',
        })}
      </CardSubTitle>
      <CardSubTitle>
        {intl.formatMessage({
          id: 'authentication.setPassword.criteria',
        })}
      </CardSubTitle>
      {!IS_MOBILE &&
        criterias.map(criteria => (
          <Criteria
            key={criteria.type}
            style={criteria.ok ? { color: 'rgb(108, 132, 72)' } : {}}
          >
            <CriteriaIcon>
              {criteria.ok ? <CheckOutlined /> : <MinusOutlined />}
            </CriteriaIcon>
            <CriteriaText>{criteria.intl}</CriteriaText>
          </Criteria>
        ))}
      <Form
        onFinish={onFinish}
        initialValues={currentPassword ? { password: currentPassword } : {}}
        onValuesChange={onChange}
      >
        <Form.Item
          colon={false}
          name="password"
          label={intl.formatMessage({
            id: 'registration.form.password',
          })}
          hasFeedback
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'error.password',
              }),
            },
            () => ({
              validator(rule, value) {
                if (passwordMeetsCriteria(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  intl.formatMessage({
                    id: 'error.password.simple',
                  })
                );
              },
            }),
          ]}
        >
          <Input.Password style={inputStyle} autoFocus />
        </Form.Item>
        <Form.Item
          colon={false}
          name="passwordConfirm"
          label={intl.formatMessage({
            id: 'registration.form.passwordConfirm',
          })}
          hasFeedback
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'error.passwordConfirm',
              }),
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  intl.formatMessage({
                    id: 'error.passwordConfirm',
                  })
                );
              },
            }),
          ]}
        >
          <Input.Password style={inputStyle} />
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
