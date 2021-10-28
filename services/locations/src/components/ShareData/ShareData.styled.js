import styled from 'styled-components';
import { SecondaryButton } from 'components/general';

// Constants
import { IS_MOBILE } from 'constants/environment';

export const Main = styled.main`
  width: 100%;
  min-height: 100%;
  padding: ${IS_MOBILE ? '24px' : '40px 56px'};
  display: flex;
  flex-direction: column;
`;

export const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const RequestWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 40px auto 0;
  width: 656px;
  padding: 40px 48px 80px;
  background: #f3f5f7;
  border-radius: 2px;
`;

export const StepLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 24px;
  margin-bottom: 8px;
`;

export const SubHeader = styled.h5`
  font-family: Montserrat-Bold, sans-serif;
  color: inherit;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 22px;
`;

export const InfoBlock = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
  width: 524px;
`;

export const RequestContent = styled.div`
  margin-bottom: 24px;
`;

export const FinishButtonWrapper = styled.div`
  display: flex;
  justify-content: ${({ align }) => align};
  margin-top: 24px;
`;

export const UploadMessage = styled.p`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

export const UploadButton = styled.button`
  position: relative;
  overflow: hidden;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: ${IS_MOBILE ? '100%' : '200px'};
  height: 48px;

  padding: 8px 20px;
  border: none;
  border-radius: 24px;

  cursor: pointer;

  background-color: rgb(155, 173, 191);
  &:hover {
    background-color: rgb(195, 206, 217);
  }

  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Bold, sans-serif;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
`;

export const UploadProgress = styled.div`
  display: flex;
  width: 200px;
`;

export const StyledSecondaryButton = styled(SecondaryButton)`
  border-color: white;
  color: white;
`;
