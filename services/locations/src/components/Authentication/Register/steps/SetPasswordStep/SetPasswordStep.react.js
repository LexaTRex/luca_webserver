import React, { useState, useRef, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Form, Input } from 'antd';
import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';

import {
  passwordMeetsCriteria,
  hasSufficientLength,
  hasNumber,
  hasLowerCase,
  hasUpperCase,
  hasSpecialCharacter,
} from 'utils/passwordCheck';

import {
  CardTitle,
  CardSubTitle,
  ButtonWrapper,
  Step,
} from 'components/Authentication/Authentication.styled';

import { CriteriaCheck } from './CriteriaCheck';
import { inputStyle } from './SetPasswordStep.styled';

export const SetPasswordStep = ({
  setPassword,
  previousSetPassword,
  next,
  back,
  navigation,
}) => {
  const intl = useIntl();
  const formReference = useRef(null);
  const defaultCriteria = {
    length: false,
    number: false,
    upperCase: false,
    lowerCase: false,
    specialChar: false,
  };
  const [criteriaCheck, setCriteriaCheck] = useState(defaultCriteria);

  const onChange = () => {
    const { password } = formReference.current.getFieldsValue();

    if (!password || password.length === 0) {
      setCriteriaCheck(defaultCriteria);
    }

    if (password.length > 0) {
      setCriteriaCheck({
        length: hasSufficientLength(password),
        number: hasNumber(password),
        upperCase: hasUpperCase(password),
        lowerCase: hasLowerCase(password),
        specialChar: hasSpecialCharacter(password),
      });
    }
  };

  useEffect(() => {
    if (previousSetPassword) {
      onChange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onFinish = values => {
    setPassword(values.password);
    next();
  };

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
      <CriteriaCheck check={criteriaCheck} />
      <Form
        onFinish={onFinish}
        initialValues={{ password: previousSetPassword || '' }}
        onValuesChange={onChange}
        ref={formReference}
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
          <SecondaryButton onClick={back}>
            {intl.formatMessage({
              id: 'authentication.form.button.back',
            })}
          </SecondaryButton>
          <PrimaryButton $isButtonWhite htmlType="submit">
            {intl.formatMessage({
              id: 'authentication.form.button.next',
            })}
          </PrimaryButton>
        </ButtonWrapper>
      </Form>
    </>
  );
};
