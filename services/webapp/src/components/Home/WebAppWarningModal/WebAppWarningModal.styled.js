import styled from 'styled-components';

import { Headline, Text } from 'components/Text';

export const StyledModalContainer = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  position: fixed;
  background-color: rgba(232, 231, 229, 0.6);
`;
export const StyledContainer = styled.div`
  top: 16px;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 85vh;
  margin: auto;
  display: flex;
  z-index: 10000;
  padding: 16px 32px;
  border-radius: 7px;
  position: absolute;
  flex-direction: column;
  background-color: #fff;
`;
export const StyledContent = styled.div`
  flex: 1;
  display: flex;
  overflow-x: hidden;
  overflow-y: scroll;
  flex-direction: column;
`;
export const StyledFooter = styled.div``;
export const StyledHeadline = styled(Headline)`
  font-size: 20px;
  font-weight: bold;
  color: rgb(0, 0, 0);
  font-family: Montserrat-Bold, sans-serif;
`;
export const StyledInfoText = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: rgb(0, 0, 0);
  font-family: Montserrat-Medium, sans-serif;
`;
export const StyledDownloadImage = styled.img`
  height: 100px;
  margin: 8px 0 24px;
  object-fit: contain;

  @media (max-width: 320px) {
    display: none;
  }
`;
export const StyledStoreLogo = styled.img`
  height: 53px;
  object-fit: contain;
`;
export const StyledStoreLink = styled.a`
  border: none;
  outline: none;
  background: transparent;
`;
export const StyledStoreWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 32px 0 0;
  justify-content: center;
`;
export const StyledSubmitButtonWrapper = styled.div`
  display: flex;
  margin-top: 8px;
  justify-content: flex-end;
`;
