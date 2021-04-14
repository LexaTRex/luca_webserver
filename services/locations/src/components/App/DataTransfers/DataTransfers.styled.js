import styled from 'styled-components';

export const DataTransfersWrapper = styled.div``;

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

export const contentStyles = {
  backgroundColor: '#f3f5f7',
};

export const sliderStyles = {
  ...contentStyles,
  borderRight: '1px solid rgb(151, 151, 151)',
};
