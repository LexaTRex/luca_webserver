import styled from 'styled-components';
import { LeftOutlined } from '@ant-design/icons';

export const Navigation = styled.div`
  display: flex;
  font-family: Montserrat-Bold, sans-serif;
  font-size: 14px;
  font-weight: bold;
  align-items: center;
  cursor: pointer;
  margin-top: 40px;
  margin-left: 42px;
`;

export const StyledLeftOutlined = styled(LeftOutlined)`
  margin-right: 14px;
  font-size: 10px;
`;
