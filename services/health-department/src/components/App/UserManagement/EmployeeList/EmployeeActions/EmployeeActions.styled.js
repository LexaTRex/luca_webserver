import styled from 'styled-components';
import BaseIcon from '@ant-design/icons';

export const IconWrapper = styled.div``;

const baseStyles = {
  fontFamily: 'Montserrat-Bold,sans-serif',
  fontSize: 16,
  fontWeight: 'bold',
  padding: '0 40px',
};

export const cancelStyle = {
  ...baseStyles,
  border: 'none',
  boxShadow: 'none',
  backgroundColor: 'white',
};

export const buttonStyle = {
  ...baseStyles,
  backgroundColor: 'rgb(195, 206, 217)',
};

export const Icon = styled(BaseIcon)`
  color: black;
  margin: 0 4px;
  font-size: 16px;
`;
