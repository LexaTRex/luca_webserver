import styled from 'styled-components';
import { Media } from 'utils/media';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #262626;
`;

export const ForgotPasswordWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  @media (max-width: 900px) and (orientation: landscape) {
    align-items: stretch;
    justify-content: flex-end;
  }
`;

export const ForgotPasswordCard = styled.div`
  max-width: 50%;
  margin-left: -150px;
  padding: 40px;
  background: rgb(184, 202, 211);
  border-radius: 2px;
  width: 624px;

  ${Media.mobile`
    width: 100%;
    max-width: none;

    max-height: 70%;
    overflow-y: scroll;

    padding: 24px 24px 32px;
    margin: 16px 32px 0;
  `}
`;

export const Headline = styled.h1`
  font-size: 42px;
  margin-bottom: 32px;
`;

export const LinkWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;

  ${Media.mobile`
  margin-top: 40px;  
  flex-direction: column;
  `}
`;

export const Link = styled.a`
  text-decoration: underline;
  ${Media.mobile`
  margin-bottom: 24px;  
  `}
`;

export const Logo = styled.img`
  height: 94px;
  margin-top: 40px;
  margin-left: 56px;

  ${Media.mobile`
    width: 78px;
    height: 59px;

    margin: 32px 0 0 32px;
  `}
`;

export const SubTitle = styled.div`
  color: white;
  display: flex;
  align-items: flex-end;
  margin-left: 24px;
  margin-bottom: -4px;

  ${Media.mobile`
    margin-left: 16px;
    margin-bottom: 8px;

    font-size: 10px;
  `}

  @media (max-width: 900px) and (orientation: landscape) {
    display: none;
  }
`;

export const HeaderWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
`;

export const Title = styled.div`
  font-size: 24px;
  margin-bottom: 16px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;

  ${Media.mobile`
    margin-top: 40px;  
  `}
`;

export const buttonStyle = {
  fontFamily: 'Montserrat-Bold, sans-serif',
  fontSize: 14,
  fontWeight: 'bold',
  padding: '0 40px',
};
