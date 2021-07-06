import styled from 'styled-components';
import { Button } from 'antd';

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

export const InfoBlock = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 21px;
  width: 524px;
`;

export const RequestContent = styled.div`
  margin-bottom: 40px;
`;

export const FinishButtonWrapper = styled.div`
  display: flex;
  justify-content: ${({ align }) => align};
  margin-top: 40px;
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

  background-color: rgb(195, 206, 217);
  &:hover {
    background-color: #9badbf;
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

export const CustomButton = styled(Button)`
  height: 40px;
  width: ${({ width }) => (IS_MOBILE ? '100%' : width)};
  background-color: ${({ $bgColor }) => $bgColor};
`;
