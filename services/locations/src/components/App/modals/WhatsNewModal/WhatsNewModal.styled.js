import styled from 'styled-components';

export const Wrapper = styled.div`
  display: inline-block;
  width: 480px;
  flex-direction: column;
  padding-bottom: 32px;
`;

export const StyledImage = styled.img`
  width: 220px;
  display: block;
  margin: auto;
  padding-bottom: 32px;
`;

export const Headline = styled.div`
  color: rgba(255, 255, 255, 0.87);
  font-family: Montserrat-Bold, sans-serif;
  font-size: 20px;
  font-weight: bold;
  max-width: 90%;
  padding-bottom: 32px;
`;

export const Content = styled.div`
  color: rgba(255, 255, 255, 0.87);
  font-size: 14px;
  font-weight: 500;
  width: 90%;
  padding-bottom: 40px;
`;

export const ConfirmationButton = styled.button``;

export const Link = styled.a`
  color: rgba(255, 255, 255, 0.87);
  font-family: Montserrat-Bold, sans-serif;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 24px;
  text-decoration: none;
`;

export const buttonStyles = {
  background: 'white',
  color: 'rgba(0, 0, 0, 0.87)',
  fontFamily: 'Montserrat-Bold, sans-serif',
  fontWeight: 'bold',
  fontSize: 14,
  padding: '0 40px',
  float: 'right',
};
