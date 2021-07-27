import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input } from 'antd';

export const FormItem = ({
  generatedUUID,
  fieldName,
  validator,
  width,
  isMandatory,
}) => {
  const { formatMessage } = useIntl();
  const FIELD_NAME = `contactDataForm.${fieldName}`;
  return (
    <Form.Item name={generatedUUID} rules={validator}>
      <Input
        data-cy={fieldName}
        type="text"
        autoComplete="new-password"
        placeholder={
          isMandatory
            ? `* ${formatMessage({
                id: FIELD_NAME,
              })}`
            : `${formatMessage({
                id: FIELD_NAME,
              })}`
        }
        width={width}
      />
    </Form.Item>
  );
};
