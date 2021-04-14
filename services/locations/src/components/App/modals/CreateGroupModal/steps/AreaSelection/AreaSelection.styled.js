import { Button } from 'antd';
import styled from 'styled-components';

export const AddAreaWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const AddAreaText = styled.div`
  color: rgb(0, 0, 0);
  font-family: Montserrat-SemiBold, sans-serif;
  font-size: 14px;
  font-weight: 600;
  margin-right: 16px;
`;

export const AddArea = styled.div`
  cursor: pointer;
  display: flex;
`;
export const InputContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
export const TrashIcon = styled.img`
  width: 20px;
  height: 20px;
`;
export const RemoveButton = styled(Button)`
  padding: 0;
  width: 24px;
  height: 24px;
  border: none;
  outline: none;
  display: flex;
  margin-left: 4px;
  border-right: 38px;
  align-items: center;
  justify-content: center;
`;
