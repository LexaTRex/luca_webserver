import styled from 'styled-components';

export const Wrapper = styled.div`
  margin: 40px;
  display: flex;
  overflow-x: hidden;
  flex-direction: column;
`;

export const Header = styled.div`
  width: 100%;
  overflow-x: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-SemiBold, sans-serif;
  font-size: 34px;
  font-weight: 600;
  margin-bottom: 48px;
`;

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
  border-bottom: 1px solid rgb(151, 151, 151);
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
};
