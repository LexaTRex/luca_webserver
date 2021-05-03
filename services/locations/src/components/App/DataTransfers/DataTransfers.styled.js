import styled from 'styled-components';

export const DataTransfersWrapper = styled.div``;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 40px;
`;

export const Header = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-SemiBold, sans-serif;
  font-size: 34px;
  font-weight: 600;
  margin-bottom: 48px;
`;

export const buttonStyles = {
  backgroundColor: 'rgb(253, 172, 114)',
  color: 'rgba(0, 0, 0, 0.87)',
  fontFamily: 'Montserrat-Bold, sans-serif',
  fontSize: 14,
  fontWeight: 'bold',
  padding: '0 40px',
};

export const contentStyles = {
  backgroundColor: '#f3f5f7',
};

export const sliderStyles = {
  ...contentStyles,
  borderRight: '1px solid rgb(151, 151, 151)',
};
