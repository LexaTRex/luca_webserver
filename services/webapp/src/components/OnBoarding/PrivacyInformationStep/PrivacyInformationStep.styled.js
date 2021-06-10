import styled from 'styled-components';

import { SecondaryButton } from '../../Buttons';
import { SmallHeadline, Text } from '../../Text';

export const StyledLucaLogo = styled.img`
  height: 48px;
  width: 87px;
  margin-bottom: 32px;
`;
export const StyledContainer = styled.div`
  flex: 1;
  display: flex;
  overflow-x: hidden;
  overflow-y: scroll;
  box-sizing: border-box;
  flex-direction: column;
  background-color: #000;
  padding: 32px 32px 0 32px;
`;
export const StyledContent = styled.main`
  flex: 1;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 32px;
`;
export const StyledHeadline = styled(SmallHeadline)`
  color: #ffffff;
  font-size: 20px;
  margin-top: 32px;
`;
export const StyledInfoText = styled(Text)`
  color: #fff;
  padding: 8px 0;
  display: block;
`;
export const StyledSecondaryButton = styled(SecondaryButton)`
  width: 100%;
  height: 48px;
  margin-top: 12px;
`;
export const StyledFooter = styled.footer`
  height: 72px;
`;
