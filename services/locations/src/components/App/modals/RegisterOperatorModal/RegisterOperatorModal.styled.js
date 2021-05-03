import styled from 'styled-components';

const font = 'Montserrat-Bold, sans-serif';

export const Wrapper = styled.div`
  width: 700px;
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
