import QrReader from 'react-qr-reader';
import styled from 'styled-components';

export const StyledContent = styled.div`
  flex: 1;
`;
export const StyledQRReader = styled(QrReader)`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  section:only-child {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
export const StyledFooter = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
