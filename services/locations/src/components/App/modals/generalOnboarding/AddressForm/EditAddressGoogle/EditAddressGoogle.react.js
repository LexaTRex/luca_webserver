import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Form } from 'antd';

import { ManualAddressText } from 'components/App/modals/generalOnboarding/ManualAddressText';
import { ManualInputButton } from 'components/App/modals/generalOnboarding/Onboarding.styled';
import {
  LocationSearch,
  FormFields,
} from 'components/App/modals/generalOnboarding/GoogleForms';
import { ButtonWrapper } from '../ButtonWrapper';

export const EditAddressGoogle = ({ close, finishStep }) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  const [showManualInput, setShowManualInput] = useState(false);
  const [isError, setIsError] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [temporaryAddress, setTemporaryAddress] = useState(null);
  const [filled, setFilled] = useState(!!temporaryAddress);

  const onFinish = data => {
    setTemporaryAddress(data);
    finishStep(data);
  };

  return (
    <Form form={form} onFinish={onFinish} initialValues={temporaryAddress}>
      <LocationSearch
        formElement={form}
        setDisabled={setDisabled}
        isError={isError}
        setIsError={setIsError}
        setFilled={setFilled}
      />
      <ManualInputButton
        onClick={() => {
          setShowManualInput(true);
          setDisabled(false);
        }}
      >
        {intl.formatMessage({ id: 'addressInput.manualInputTitle' })}
      </ManualInputButton>
      {showManualInput && <ManualAddressText />}
      <FormFields show={filled || showManualInput} disabled={disabled} />
      <ButtonWrapper
        close={close}
        isError={isError}
        disabled={isError || (!filled && !showManualInput)}
      />
    </Form>
  );
};
