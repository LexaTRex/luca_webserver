import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: 1;
  width: 100vw;
  display: flex;
  height: 100vh;
  padding: 16px 0;
  overflow-x: hidden;
  overflow-y: scroll;
  box-sizing: border-box;
  flex-direction: column;
  background-color: #dae0e7;
`;

export const HeaderWrapper = styled.header`
  display: flex;
  padding-left: 32px;
  padding-bottom: 16px;
  align-items: flex-end;
`;

export const HeaderLogo = styled.img`
  height: 48px;
  color: black;
`;

export const ErrorHeadline = styled.div`
  font-size: 20px;
  line-height: 26px;
  letter-spacing: 0;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Bold, sans-serif;
`;

export const ErrorDescription = styled.div`
  font-size: 14px;
  max-width: 600px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0;
  text-align: center;
  margin-bottom: 30px;
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Medium, sans-serif;
`;

export const ErrorGraphic = styled.img`
  max-width: 70%;
  padding: 16px 0 8px;
  object-position: center;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export const FooterWrapper = styled.div`
  display: flex;
  margin: 0 0 30px 42px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const Link = styled.a`
  color: black;
  display: block;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  font-family: Montserrat-SemiBold, sans-serif;
`;
