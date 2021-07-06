import styled from 'styled-components';
import { Media } from 'utils/media';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const AuthenticationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  @media (max-width: 900px) and (orientation: landscape) {
    align-items: stretch;
    justify-content: flex-end;
  }
`;

export const Description = styled.div`
  font-family: Montserrat-Bold, sans-serif;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 24px;
`;

export const AuthenticationCard = styled.div`
  max-width: 50%;
  margin-left: -150px;
  padding: 40px;
  background: rgb(195, 206, 217);
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

export const HeaderWrapper = styled.div`
  display: flex;
`;

export const AuthenticationButton = styled.button.attrs({
  type: 'submit',
})`
  min-width: 200px;
  height: 48px;

  background: rgb(255, 255, 255);

  border: 1px solid transparent;
  border-radius: 24px;

  cursor: pointer;

  &:active,
  &:focus {
    outline: none;
  }

  &:active {
    border: 1px solid #999;
  }

  transition: border 200ms ease;

  ${Media.mobile`
    width: 100%;
  `}
`;

export const CardTitle = styled.div`
  font-family: Montserrat-Bold, sans-serif;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 24px;
`;

export const CardSubTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
  ${Media.mobile`
    display: none;
  `}
`;

export const Step = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: ${({ multipleButtons }) =>
    multipleButtons ? 'space-between' : 'flex-end'};
  margin-top: 24px;

  ${Media.mobile`
    margin-top: 40px;
    flex-direction: column;  
  `}
`;

export const backButtonStyles = {
  fontFamily: 'Montserrat-Bold, sans-serif',
  fontSize: 14,
  fontWeight: 'bold',
  padding: '0 40px',
  background: 'transparent',
  border: '1px solid black',
  marginBottom: 16,
};

export const nextButtonStyles = {
  fontFamily: 'Montserrat-Bold, sans-serif',
  fontSize: 14,
  fontWeight: 'bold',
  padding: '0 40px',
};
