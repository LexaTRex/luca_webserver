import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { Button, Form, Input, notification, Popconfirm } from 'antd';

import { createEmployee } from 'network/api';

import { useModal } from 'components/hooks/useModal';

import { Wrapper, ButtonRow, Info, Password } from './AddEmployeeModal.styled';
import { getFormElements } from './AddEmployeeModal.helper';

export const AddEmployeeModal = () => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [newUserPassword, setNewUserPassword] = useState(null);
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

  const close = () => {
    closeModal();
    queryClient.invalidateQueries('employees');
  };

  return (
    <>
      {newUserPassword ? (
        <Wrapper>
          <Info>
            {intl.formatMessage({
              id: 'userManagement.created.info',
            })}
          </Info>
          <Password>{newUserPassword}</Password>
          <ButtonRow>
            <Popconfirm
              placement="top"
              title={intl.formatMessage({
                id: 'userManagement.created.confirm',
              })}
              onConfirm={close}
              okText={intl.formatMessage({
                id: 'userManagement.created.confirm.ok',
              })}
              cancelText={intl.formatMessage({
                id: 'userManagement.created.confirm.cancel',
              })}
            >
              <Button
                type="primary"
                style={{
                  backgroundColor: 'white',
                  padding: '0 40px',
                  color: 'black',
                }}
              >
                {intl.formatMessage({
                  id: 'userManagement.created.button',
                })}
              </Button>
            </Popconfirm>
          </ButtonRow>
        </Wrapper>
      ) : (
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
              >
                <Input />
              </Form.Item>
            ))}

            <ButtonRow>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: 'white',
                    padding: '0 40px',
                    color: 'black',
                  }}
                >
                  {intl.formatMessage({
                    id: 'userManagement.create.button',
                  })}
                </Button>
              </Form.Item>
            </ButtonRow>
          </Form>
        </Wrapper>
      )}
    </>
  );
};
