import React from 'react';
import { Form } from 'antd';

import { ManualAddressText } from 'components/App/modals/generalOnboarding/ManualAddressText';
import { FormFields } from 'components/App/modals/generalOnboarding/GoogleForms';
import { ButtonWrapper } from '../ButtonWrapper';

export const EditAddressManual = ({ close, finishStep }) => {
  const [form] = Form.useForm();

  const onFinish = data => {
    finishStep(data);
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <ManualAddressText />
      <FormFields show />
      <ButtonWrapper close={close} />
    </Form>
  );
};
