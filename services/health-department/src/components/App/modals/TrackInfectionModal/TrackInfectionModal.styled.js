import styled from 'styled-components';
import { Input, Form } from 'antd';

export const NewTrackingWrapper = styled.div`
  width: 100%;
`;

export const Info = styled.div`
  font-size: 14px;
  color: black;
  margin-bottom: 24px;
`;

export const Divider = styled.div`
  margin: 0 12px;
  display: flex;
  height: 80px;
  align-items: center;
`;

export const ItemWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const SubmitWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

export const StyledInput = styled(Input)`
  height: 80px;
  width: 160px;
  font-size: 24px;
  text-align: center;
`;

export const StyledFormItem = styled(Form.Item)`
  width: auto !important;
  max-width: 160px;
`;
