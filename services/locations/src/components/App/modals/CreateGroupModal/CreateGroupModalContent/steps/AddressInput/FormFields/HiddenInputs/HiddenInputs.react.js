import React from 'react';
import { Form, Input } from 'antd';

const hiddenInputFields = ['lat', 'lng', 'state'];

export const HiddenInputs = () => {
  return (
    <>
      {hiddenInputFields.map(field => (
        <Form.Item
          style={{ display: 'none' }}
          key={field}
          name={field}
          label=""
        >
          <Input />
        </Form.Item>
      ))}
    </>
  );
};
