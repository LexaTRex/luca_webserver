import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, notification } from 'antd';
import { PrimaryButton, SecondaryButton } from 'components/general';

import { useModal } from 'components/hooks/useModal';

import { createEmployee } from 'network/api';

import { getFormattedPhoneNumber } from 'utils/checkPhoneNumber';
import { Wrapper, ButtonRow, Info } from '../AddEmployeeModal.styled';
import { useFormElements } from '../useAddEmployee';

export const AddEmployeeForm = ({ setNewUserPassword }) => {
  const intl = useIntl();
  const formElements = useFormElements();
  const [, closeModal] = useModal();

  const handleServerError = () =>
    notification.error({
      message: intl.formatMessage({ id: 'userManagement.create.error' }),
    });

  const onFinish = async ({ phone, ...values }) => {
    const formattedPhone = getFormattedPhoneNumber(phone);
    try {
      const newEmployee = await createEmployee({
        ...values,
        phone: formattedPhone,
      });
      if (!newEmployee) {
        handleServerError();
      }
      notification.success({
        message: intl.formatMessage({ id: 'userManagement.create.success' }),
      });
      setNewUserPassword(newEmployee.password);
    } catch {
      handleServerError();
    }
  };

  return (
    <Wrapper>
      <Info>
        {intl.formatMessage({
          id: 'userManagement.create.info',
        })}
      </Info>
      <Form onFinish={onFinish}>
        {formElements.map(element => (
          <Form.Item
            key={element.key}
            rules={element.rules}
            name={element.key}
            label={intl.formatMessage({
              id: `userManagement.${element.key}`,
            })}
            colon={false}
          >
            <Input style={{ borderColor: 'black' }} />
          </Form.Item>
        ))}

        <ButtonRow>
          <SecondaryButton style={{ marginRight: 24 }} onClick={closeModal}>
            {intl.formatMessage({
              id: 'cancel',
            })}
          </SecondaryButton>
          <Form.Item>
            <PrimaryButton htmlType="submit">
              {intl.formatMessage({
                id: 'userManagement.create.button',
              })}
            </PrimaryButton>
          </Form.Item>
        </ButtonRow>
      </Form>
    </Wrapper>
  );
};
