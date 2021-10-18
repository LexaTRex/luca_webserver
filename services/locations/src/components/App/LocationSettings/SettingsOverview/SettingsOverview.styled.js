import styled from 'styled-components';

export const SettingsContent = styled.div`
  padding: 24px 32px;
  background-color: white;
`;

export const Heading = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 32px;
`;

export const Overview = styled.div`
  border-bottom: ${({ isLast }) => (isLast ? 0 : 1)}px solid rgb(151, 151, 151);
`;

export const contentStyles = {
  backgroundColor: '#f3f5f7',
};

export const sliderStyles = {
  ...contentStyles,
  borderRight: '1px solid rgb(151, 151, 151)',
};

export const buttonStyles = {
  fontFamily: 'Montserrat-Bold, sans-serif',
  fontSize: 14,
  fontWeight: 'bold',
  padding: '0 40px',
  border: '1px solid rgb(80, 102, 124)',
  color: 'black',
};
