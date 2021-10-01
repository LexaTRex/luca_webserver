import React from 'react';
import { Input, Form } from 'antd';
import { useIntl } from 'react-intl';
import { usePersonNameValidator } from 'components/hooks/useValidators';

export const EmployeeName = ({ editing, employee }) => {
  const intl = useIntl();
  const firstNameValidator = usePersonNameValidator('firstName');
  const lastNameValidator = usePersonNameValidator('lastName');

  return (
    <>
      {editing ? (
        <div>
          <Form.Item
            name="firstName"
            label={intl.formatMessage({ id: 'profile.firstname' })}
            rules={firstNameValidator}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label={intl.formatMessage({ id: 'profile.lastname' })}
            rules={lastNameValidator}
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
