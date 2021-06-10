import styled from 'styled-components';
import { Headline, Text } from 'components/Text';
import { SecondaryButton } from '../../Buttons';

export const StyledContainer = styled.div`
  flex: 1;
  display: flex;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 32px 32px 0;
  box-sizing: border-box;
  flex-direction: column;
  background-color: rgb(218, 224, 231);
`;
export const StyledLucaLogo = styled.img`
  height: 48px;
  width: 87px;
  margin-bottom: 32px;
`;
export const StyledContent = styled.main`
  flex: 1;
  display: flex;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 32px;
  flex-direction: column;
`;
export const StyledFooter = styled.footer`
  padding: 0;
  height: 72px;
`;
export const StyledHeadline = styled(Headline)`
  color: #000;
  font-size: 20px;
  margin-bottom: 24px;
`;
export const StyledInfoText = styled(Text)`
  display: block;
  color: #000;
  line-height: 20px;
  margin-bottom: 22px;
`;
export const StyledWarning = styled.div`
  color: #000;
  font-weight: bold;
  margin-bottom: 22px;
`;
export const StyledHelloImage = styled.img`
  height: 100px;
  margin: 8px 0 24px;
  object-fit: contain;

  @media (max-width: 320px) {
    display: none;
  }
`;
export const StyledStoreLogo = styled.img`
  height: 60px;
  object-fit: contain;
`;
export const StyledStoreLink = styled.a`
  border: none;
  outline: none;
  background: transparent;
`;
export const StyledStoreWrapper = styled.div`
  display: flex;
  padding: 8px 0;
  flex-wrap: wrap;
  justify-content: center;
`;
export const StyledPrimaryButton = styled(SecondaryButton)`
  width: 100%;
  height: 48px;
  margin-top: 12px;
`;
