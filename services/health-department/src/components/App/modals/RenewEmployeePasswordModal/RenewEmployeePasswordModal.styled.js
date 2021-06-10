import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100%;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

export const Info = styled.div`
  margin-bottom: 24px;
  font-size: 16px;
`;

export const Password = styled.div`
  font-weight: bold;
  font-size: 36px;
  text-align: center;
  margin-bottom: 24px;
`;

const baseStyles = {
  backgroundColor: 'white',
  padding: '0 40px',
  color: 'black',
  fontFamily: 'Montserrat-Bold, sans-serif',
  fontSize: 16,
  fontWeight: 'bold',
};

export const cancelStyle = {
  ...baseStyles,
  marginRight: 24,
  border: 'none',
  boxShadow: 'none',
};

export const confirmStyle = {
  ...baseStyles,
  background: 'rgb(195, 206, 217)',
};
