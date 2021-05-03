import styled from 'styled-components';

const font = 'Montserrat-Bold, sans-serif';

export const Explain = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 32px;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: ${({ align }) => align};
  margin-top: 80px;
`;

export const DownloadRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const baseStyle = {
  padding: '0 40px',
  fontFamily: font,
  fontSize: 14,
  fontWeight: 'bold',
  color: 'rgba(0, 0, 0, 0.87)',
};

export const downloadStyle = {
  ...baseStyle,
  backgroundColor: 'rgb(211, 222, 195)',
  width: 200,
};
