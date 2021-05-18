import styled from 'styled-components';

const font = 'Montserrat-Bold, sans-serif';
const fontColor = 'rgba(0, 0, 0, 0.87)';

export const StyledSwitchContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;
export const StyledCSVWrapper = styled.div`
  text-align: center;
`;

export const buttonStyle = {
  fontFamily: font,
  fontSize: 14,
  fontWeight: 'bold',
  padding: '0 40px',
  background: 'transparent',
  border: '1px solid black',
  color: fontColor,
  marginBottom: 16,
};

export const linkButtonStyle = {
  ...buttonStyle,
  padding: 0,
  textTransform: 'uppercase',
  alignSelf: 'center',
  border: 'none',
  boxShadow: 'none',
};

export const linkInfoButton = {
  fontSize: 16,
  marginLeft: '8px',
};
