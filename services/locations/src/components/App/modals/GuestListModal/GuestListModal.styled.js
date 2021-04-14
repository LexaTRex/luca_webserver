import styled from 'styled-components';

const getFontFamily = isHeadline =>
  isHeadline ? 'font-family: Montserrat-SemiBold, sans-serif' : '';

const getMargin = isHeadline => (isHeadline ? 'margin-bottom: 16px' : '');

const getBorder = isHeadline =>
  isHeadline ? 'border-bottom: 1px solid rgb(151, 151, 151)' : '';

export const Wrapper = styled.div`
  display: flex;
  width: 700px;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  ${({ headline }) => getBorder(headline)};
`;

export const Count = styled.div`
  display: flex;
  margin-bottom: 24px;
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Medium, sans-serif;
  font-size: 16px;
  font-weight: 500;
`;

export const Time = styled.div`
  ${({ headline }) => getFontFamily(headline)};
  ${({ headline }) => getMargin(headline)};
  flex-basis: 25%;
`;

export const Date = styled.div`
  ${({ headline }) => getFontFamily(headline)};
  ${({ headline }) => getMargin(headline)};
  flex-basis: 15%;
`;

export const Guest = styled.div`
  ${({ headline }) => getFontFamily(headline)};
  ${({ headline }) => getMargin(headline)};
  flex-basis: 60%;
`;
