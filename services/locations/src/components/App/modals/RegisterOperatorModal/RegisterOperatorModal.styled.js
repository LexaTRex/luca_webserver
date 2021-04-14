import styled from 'styled-components';

const font = 'Montserrat-Bold, sans-serif';

export const Wrapper = styled.div`
  width: 700px;
`;

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

export const DownloadTitle = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: ${font};
  font-size: 16px;
  font-weight: 500;
`;

export const Expand = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: height 1s;
  height: ${({ open }) => (open ? '200px' : '0')};
  border-top: ${({ open }) => (open ? '1px solid rgb(151, 151, 151)' : '')};
  margin-top: ${({ open }) => (open ? '32px' : '')};
  overflow: hidden;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

export const nextButtonStyles = {
  backgroundColor: 'rgb(195, 206, 217)',
  color: 'rgba(0, 0, 0, 0.87)',
  fontFamily: font,
  fontSize: 14,
  fontWeight: 'bold',
  padding: '0 40px',
};

const baseStyle = {
  padding: '0 40px',
  fontFamily: font,
  fontSize: 14,
  fontWeight: 'bold',
  color: 'rgba(0, 0, 0, 0.87)',
};

export const disabledStyle = {
  ...baseStyle,
  backgroundColor: 'rgb(218, 224, 231)',
  opacity: '0.5',
  cursor: 'no-drop',
};

export const downloadStyle = {
  ...baseStyle,
  backgroundColor: 'rgb(211, 222, 195)',
  width: 200,
};

export const copyStyle = {
  ...baseStyle,
  backgroundColor: 'transparent',
  width: 200,
  border: '1px solid rgb(80, 102, 124)',
};
