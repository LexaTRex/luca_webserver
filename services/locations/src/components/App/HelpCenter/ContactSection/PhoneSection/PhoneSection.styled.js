import styled from 'styled-components';
import { PhoneOutlined } from '@ant-design/icons';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const SupportCode = styled.div`
  color: rgb(80, 102, 124);
  font-family: Montserrat-Bold, sans-serif;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 24px;
`;

export const StyledPhoneOutlined = styled(PhoneOutlined)`
  font-size: 32px;
  margin-bottom: 20px;
`;
