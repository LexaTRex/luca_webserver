import styled from 'styled-components';

export const Wrapper = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24px;
  display: flex;
  z-index: 999999;
  position: fixed;
  overflow: scroll;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #dae0e7;
`;

export const HeaderWrapper = styled.header`
  display: flex;
  margin-bottom: 60px;
  align-items: flex-end;
`;

export const HeaderSubTitle = styled.h4`
  color: black;
  line-height: 12px;
  margin: 0 0 0 12px;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export const HeaderLogo = styled.img`
  height: 48px;
  color: black;
`;

export const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 48px;
`;

export const ErrorGraphic = styled.img`
  max-width: 100%;
  padding: 16px 0 8px;
  object-position: center;
`;

export const Title = styled.div`
  font-size: 20px;
  line-height: 26px;
  letter-spacing: 0;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Bold, sans-serif;
`;

export const Description = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0;
  text-align: center;
  color: rgba(0, 0, 0, 0.87);
`;
