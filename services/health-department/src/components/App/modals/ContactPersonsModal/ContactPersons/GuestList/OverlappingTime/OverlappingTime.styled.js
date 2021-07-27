import styled from 'styled-components';
import { InputNumber } from 'antd';

export const OverlapSelectorWrapper = styled.div`
  color: black;
  padding: 16px 0 32px 0;
  display: flex;
  flex-direction: column;
  font-family: Montserrat-Bold, sans-serif;
  font-size: 14px;
  font-weight: bold;
`;

export const StyledInputNumber = styled(InputNumber)`
  margin-top: 8px;
  width: 150px;
`;
