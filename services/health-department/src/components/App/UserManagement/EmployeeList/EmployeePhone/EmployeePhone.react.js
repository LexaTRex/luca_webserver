import React from 'react';
import { Input, Form } from 'antd';

export const EmployeePhone = ({ editing, employee }) => {
  return (
    <>
      {editing ? (
        <Form.Item name="phone">
          <Input />
        </Form.Item>
      ) : (
        <>{employee.phone}</>
      )}
    </>
  );
};
