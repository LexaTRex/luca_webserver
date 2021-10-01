import { Form } from 'antd';
import styled from 'styled-components';

export const DeviceAuthenticationWrapper = styled.div`
  flex: 1;
  display: flex;
  height: 400px;
  flex-direction: column;
`;

export const DeviceAuthenticationContent = styled.div`
  flex: 1;
  width: 100%;
  display: flex;

  .ant-form-item {
    display: flex;
    align-items: center;
    margin-bottom: 0 !important;
  }
`;

export const RadioWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const FormItem = styled(Form.Item)`
  flex: 1;
`;

export const RoleName = styled.span`
  font-size: 14px;
  font-weight: bold;
  font-family: Montserrat-Bold, sans-serif;
`;
export const RoleDescription = styled.div`
  font-size: 14px;
  font-family: Montserrat-Medium, sans-serif;
`;
