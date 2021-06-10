import styled from 'styled-components';

import { SecondaryButton } from '../../Buttons';
import { Headline, Text, Link } from '../../Text';

export const StyledContainer = styled.div`
  flex: 1;
  display: flex;
  overflow-x: hidden;
  overflow-y: scroll;
  box-sizing: border-box;
  flex-direction: column;
  background-color: #000000;
  padding: 32px 32px 0 32px;
`;
export const StyledLucaLogo = styled.img`
  height: 48px;
  width: 87px;
  margin-bottom: 32px;
`;
export const StyledContent = styled.main`
  flex: 1;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 32px;
`;
export const StyledFooter = styled.footer`
  height: 72px;
`;
export const StyledPrimaryButton = styled(SecondaryButton)`
  width: 100%;
  height: 48px;
  margin-top: 12px;
`;
export const StyledHeadline = styled(Headline)`
  color: #ffffff;
  font-size: 20px;
  margin-bottom: 24px;
`;
export const StyledInfoText = styled(Text)`
  display: block;
  color: #ffffff;
  line-height: 20px;
  margin-bottom: 22px;
`;
export const StyledLink = styled(Link)`
  color: #ffffff;
  font-size: 12px;
  text-decoration: underline;
`;

export const StyledWarning = styled.div`
  color: #ffffff;
  font-weight: bold;
  margin-bottom: 22px;
`;
