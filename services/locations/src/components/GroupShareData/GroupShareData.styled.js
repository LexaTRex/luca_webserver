import styled from 'styled-components';

// Constants
import { IS_MOBILE } from 'constants/environment';

export const Main = styled.main`
  width: 100%;
  min-height: 100%;

  padding: ${IS_MOBILE ? '24px' : '40px 56px'};
`;

export const RequestWrapper = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: auto;
  max-width: 656px;

  padding: 32px 32px 40px;

  background: #fed7bb;
  border-radius: 2px;
  margin-top: 40px;
`;

export const RequestTitle = styled.h2`
  margin-bottom: 48px;

  font-size: 32px;
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  line-height: 48px;
`;

export const SubHeader = styled.h5`
  font-size: 16px;
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  line-height: 24px;
`;

export const Description = styled.div`
  margin: 16px 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  font-family: Montserrat-Medium, sans-serif;
`;

export const BoldSection = styled.span`
  font-weight: 600;
  font-family: Montserrat, sans-serif;
`;

export const RequestContent = styled.div`
  margin-bottom: 32px;
`;

export const FinishButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;

  margin-top: 40px;
`;

export const UploadButtonWrapper = styled.div`
  position: relative;
  overflow: hidden;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: ${IS_MOBILE ? '100%' : '180'};
  height: 48px;

  padding: 8px 20px;
  border-radius: 2px;
  background: ${({ disabled }) =>
    disabled ? '#f5f5f5' : 'rgb(255, 255, 255)'};

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

export const UploadButton = styled.span`
  display: block;
`;

export const HiddenUpload = styled.input`
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;

  opacity: 0;

  z-index: 2;
  cursor: pointer;
`;
