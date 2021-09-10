import React, { useEffect, useState } from 'react';
import { Form, notification } from 'antd';
import { useQueryClient } from 'react-query';
import { useIntl } from 'react-intl';
import { setContactInformation } from 'network/api';
import { SecondaryButton } from 'components/general/Buttons.styled';

import {
  getEmailRule,
  getMaxLengthRule,
  getPhoneRule,
} from 'utils/validatorRules';
import { getFormattedPhoneNumber } from 'utils/checkPhoneNumber';
import { MAX_EMAIL_LENGTH, MAX_PHONE_LENGTH } from 'constants/valueLength';

import { StyledHeadline, Wrapper } from './ContactInformation.styled';
import { StyledButtonRow, Description, StyledInput } from '../Profile.styled';

export const ContactInformation = ({ department }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isRequired, setIsRequired] = useState(false);
  const useQuery = useQueryClient();

  const handleError = () =>
    notification.error({
      message: intl.formatMessage({
        id: 'notification.profile.contactInformation.error',
      }),
    });

  const onFinish = ({ email, phone }) => {
    const formattedPhone = phone?.trim()
      ? getFormattedPhoneNumber(phone)
      : undefined;
    setContactInformation({
      email: email?.trim() || undefined,
      phone: formattedPhone,
    })
      .then(response => {
        if (response.ok) {
          useQuery.invalidateQueries('healthDepartment');
          form.setFieldsValue({ phone: formattedPhone });
          notification.success({
            message: intl.formatMessage({
              id: 'notification.profile.contactInformation.success',
            }),
          });
          setIsButtonDisabled(true);
        } else {
          handleError();
        }
      })
      .catch(() => handleError());
  };

  useEffect(() => {
    form.setFields([
      {
        name: 'email',
        value: department.email || '',
        errors: [],
      },
      {
        name: 'phone',
        value: department.phone || '',
        errors: [],
      },
    ]);
  }, [form, department.email, department.phone]);

  const onValuesUpdate = (_, values) => {
    if (!values.email && !values.phone) {
      setIsRequired(true);
      setIsButtonDisabled(true);
    }
    if (values.email || values.phone) {
      setIsRequired(false);
      setIsButtonDisabled(false);
    }
    /**
     * Clear error message of fields
     * Source: https://github.com/ant-design/ant-design/issues/24599
     */
    const updatedFields = Object.keys(values)
      .filter(name => form.getFieldError(name).length)
      .map(name => ({ name, errors: [] }));
    form.setFields(updatedFields);
  };

  const validateAtLeastOneInput = () => {
    if (
      !form.getFieldValue('email').trim() &&
      !form.getFieldValue('phone').trim()
    ) {
      return Promise.reject();
    }
    return Promise.resolve();
  };

  const requireOneFieldRule = {
    required: isRequired,
    validator: () => validateAtLeastOneInput(),
    message: intl.formatMessage({
      id: 'profile.contactInformation.required',
    }),
  };

  return (
    <Wrapper>
      <StyledHeadline>
        {intl.formatMessage({ id: 'profile.contactInformation.headline' })}
      </StyledHeadline>
      <Description>
        {intl.formatMessage({ id: 'profile.contactInformation.description' })}
      </Description>
      <Form
        form={form}
        onFinish={onFinish}
        onValuesChange={onValuesUpdate}
        initialValues={{}}
      >
        <Form.Item
          colon={false}
          name="email"
          label={intl.formatMessage({
            id: 'profile.contactInformation.email',
          })}
          rules={[
            getEmailRule(intl),
            getMaxLengthRule(intl, MAX_EMAIL_LENGTH),
            requireOneFieldRule,
          ]}
        >
          <StyledInput />
        </Form.Item>
        <Form.Item
          colon={false}
          name="phone"
          label={intl.formatMessage({
            id: 'profile.contactInformation.phone',
          })}
          rules={[
            getPhoneRule(intl),
            getMaxLengthRule(intl, MAX_PHONE_LENGTH),
            requireOneFieldRule,
          ]}
        >
          <StyledInput />
        </Form.Item>
        <StyledButtonRow>
          <Form.Item>
            <SecondaryButton htmlType="submit" disabled={isButtonDisabled}>
              {intl.formatMessage({
                id: 'save',
              })}
            </SecondaryButton>
          </Form.Item>
        </StyledButtonRow>
      </Form>
    </Wrapper>
  );
};
