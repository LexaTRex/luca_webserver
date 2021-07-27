import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  @media (max-width: 900px) and (orientation: landscape) {
    align-items: stretch;
    justify-content: flex-end;
  }
`;

export const VersionFooterWrapper = styled.div`
  margin-top: auto;
  padding: 24px;
`;

export const Left = styled.div`
  background-color: #e8e7e5;
  position: absolute;
  display: flex;
  flex-direction: column;
  left: 0;
  top: 0;
  bottom: 0;
  right: 50%;

  @media (max-width: 600px) {
    width: 100%;
    height: 50%;

    right: 0;
  }
`;

export const Right = styled.img`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  right: 0;
  width: 50%;
  height: 100%;
  object-fit: cover;

  @media (max-width: 600px) {
    width: 100%;
    height: 50%;

    left: 0;
    top: 50%;
  }
`;

export const LoginCard = styled.div`
  max-width: 50%;
  margin-left: -15%;
  padding: 40px;
  background-color: #b8c0ca;
  border-radius: 2px;
  width: 624px;
  box-shadow: -10px 0 10px -8px rgba(0, 0, 0, 0.2),
    0 10px 10px -8px rgba(0, 0, 0, 0.2);
  z-index: 0;

  @media (max-width: 600px) {
    width: 100%;
    max-width: none;

    max-height: 70%;
    overflow-y: scroll;

    padding: 24px 24px 32px;
    margin: 16px 32px 0;
  }
`;

export const Headline = styled.h1`
  font-size: 42px;
  margin-bottom: 32px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

export const RegisterLink = styled.a`
  margin-top: 24px;
  margin-bottom: 24px;
  text-decoration: underline;
  display: flex;
  justify-content: flex-end;
`;

export const Logo = styled.img`
  height: 94px;
  margin-top: 40px;
  margin-left: 56px;

  @media (max-width: 600px) {
    width: 78px;
    height: 59px;

    margin: 32px 0 0 32px;
  }
`;

export const SubTitle = styled.div`
  display: flex;
  align-items: flex-end;
  margin-left: 24px;
  margin-bottom: -4px;

  @media (max-width: 900px) {
    display: none;
  }

  @media (max-width: 600px) {
    display: inherit;
    margin-left: 16px;
    margin-bottom: 8px;
    font-size: 10px;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
`;

export const ErrorMessage = styled.div`
  color: #f81d22;
`;
