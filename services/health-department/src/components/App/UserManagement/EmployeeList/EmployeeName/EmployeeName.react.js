import React from 'react';
import { Input, Form } from 'antd';
import { useIntl } from 'react-intl';

export const EmployeeName = ({ editing, employee }) => {
  const intl = useIntl();
  return (
    <>
      {editing ? (
        <div>
          <Form.Item
            name="firstName"
            label={intl.formatMessage({ id: 'profile.firstname' })}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label={intl.formatMessage({ id: 'profile.lastname' })}
          >
            <Input />
          </Form.Item>
        </div>
      ) : (
        <>{`${employee.firstName} ${employee.lastName}`}</>
      )}
    </>
  );
};
