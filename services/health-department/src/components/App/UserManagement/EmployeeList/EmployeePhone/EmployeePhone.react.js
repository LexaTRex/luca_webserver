import React from 'react';
import { usePhoneValidator } from 'components/hooks/useValidators';
import { Input } from 'antd';
import { StyledFormItem } from './EmployeePhone.styled';

export const EmployeePhone = ({ editing, employee }) => {
  const phoneValidator = usePhoneValidator('phone');

  return (
    <>
      {editing ? (
        <StyledFormItem name="phone" rules={phoneValidator}>
          <Input />
        </StyledFormItem>
      ) : (
        <>{employee.phone}</>
      )}
    </>
  );
};
