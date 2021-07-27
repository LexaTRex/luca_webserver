import styled from 'styled-components';

export const CamScannerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  margin: 0 24px;
  padding: 24px 0 0 0;
`;

export const TopWrapper = styled.div`
  height: 60vh;
`;

export const BottomWrapper = styled.div`
  position: relative;
  height: 30vh;
`;

export const CheckinBox = styled.div`
  display: flex;
  background-color: white;
  width: 100%;
  margin: 0 auto;
  padding: 8px 24px 0 24px;
  border-radius: 2px;

  position: absolute;
  bottom: 14px;

  @media (min-width: 768px) {
    padding: 24px 24px 0 24px;
  }
`;

export const Content = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: black;
  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

export const Count = styled.div`
  font-size: 68px;
  @media (max-width: 767px) {
    font-size: 24px;
  }
`;

export const SuccessWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: grey;
  opacity: 0.7;
`;

export const QrWrapper = styled.div`
  position: relative;
  margin: 24px 0;
  @media (min-width: 768px) {
    width: 50vh;
    margin: 24px auto;
  }
`;
