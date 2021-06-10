import React from 'react';
import { useIntl } from 'react-intl';
import { Button, Form, Input, notification } from 'antd';

import { useModal } from 'components/hooks/useModal';

import { createEmployee } from 'network/api';

import {
  Wrapper,
  ButtonRow,
  Info,
  buttonStyle,
  cancelStyle,
} from '../AddEmployeeModal.styled';
import { getFormElements } from '../AddEmployeeModal.helper';

export const AddEmployeeForm = ({ setNewUserPassword }) => {
  const intl = useIntl();
  const [, closeModal] = useModal();

  const onFinish = async values => {
    try {
      const newEmployee = await createEmployee(values);
      notification.success({
        message: intl.formatMessage({ id: 'userManagement.create.success' }),
      });
      setNewUserPassword(newEmployee.password);
    } catch {
      notification.error({
        message: intl.formatMessage({ id: 'userManagement.create.error' }),
      });
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
        {getFormElements(intl).map(element => (
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
          <Button style={cancelStyle} onClick={closeModal}>
            {intl.formatMessage({
              id: 'cancel',
            })}
          </Button>
          <Form.Item>
            <Button htmlType="submit" style={buttonStyle}>
              {intl.formatMessage({
                id: 'userManagement.create.button',
              })}
            </Button>
          </Form.Item>
        </ButtonRow>
      </Form>
    </Wrapper>
  );
};
