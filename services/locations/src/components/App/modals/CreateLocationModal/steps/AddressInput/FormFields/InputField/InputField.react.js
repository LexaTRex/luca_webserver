import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input } from 'antd';

export const InputField = ({ name, disabled }) => {
  const intl = useIntl();

  return (
    <Form.Item
      rules={[
        {
          required: true,
          whitespace: true,
          message: intl.formatMessage({
            id: `error.${name}`,
          }),
        },
      ]}
      key={name}
      name={name}
      label={intl.formatMessage({
        id: `card.form.${name}`,
      })}
    >
      <Input disabled={disabled} />
    </Form.Item>
  );
};
