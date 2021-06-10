import QrReader from 'react-qr-reader';
import styled from 'styled-components';

export const StyledContent = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  min-width: 75vw;
  align-items: center;
  justify-content: center;
`;
export const StyledQRReader = styled(QrReader)`
  width: 75vw;
  max-width: 450px;
  max-height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;

  section:only-child {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
export const StyledDescription = styled.div`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 20px;
  text-align: center;
  color: rgb(255, 255, 255);
  font-family: Montserrat-Medium, sans-serif;
`;
export const StyledFooter = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
