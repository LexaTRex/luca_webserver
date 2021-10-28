import styled from 'styled-components';
import { MailOutlined } from '@ant-design/icons';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 42px;
`;

export const Heading = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Bold, sans-serif;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
`;

export const Text = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Medium, sans-serif;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
`;

export const StyledMailOutlined = styled(MailOutlined)`
  font-size: 32px;
  margin-bottom: 20px;
`;
