import styled from 'styled-components';
import { Button } from 'antd';

const baseStyle = {
  padding: '0 40px',
  color: 'black',
  fontFamily: 'Montserrat-Bold, sans-serif',
  fontSize: 14,
  fontWeight: 'bold',
};

export const ContactButton = styled(Button)({
  ...baseStyle,
  backgroundColor: 'rgb(195, 206, 217)',
});

export const ContactedButton = styled(Button)({
  ...baseStyle,
  backgroundColor: 'rgb(232, 231, 229)',
  opacity: 0.5,
  cursor: 'not-allowed',
});

export const CompletedButton = styled(Button)({
  ...baseStyle,
  backgroundColor: 'rgb(211, 222, 195)',
});

export const Expiry = styled.div`
  margin-top: 8px;
  font-family: Montserrat-Bold, sans-serif;
  font-size: 14px;
  font-weight: bold;
  margin-left: 16px;
`;

export const ButtonWrapper = styled.div`
  text-align: left;
`;
