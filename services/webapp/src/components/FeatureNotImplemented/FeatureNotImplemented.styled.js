import styled from 'styled-components';
import { Headline, Text } from 'components/Text';

export const StyledContent = styled.div`
  flex: 1;
  display: flex;
  padding: 0 16px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;
export const StyledHeadline = styled(Headline)`
  font-size: 20px;
  line-height: 26px;
  text-align: center;
  color: rgba(255, 255, 255, 0.87);
`;
export const StyledText = styled(Text)`
  font-size: 14px;
  padding: 16px 0;
  line-height: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.87);
`;
export const StyledLucaLogo = styled.img`
  width: 87px;
  height: 48px;
  user-select: none;
`;
export const StyledMissingFeatureLogo = styled.img`
  height: 150px;
  margin: 16px 0;
  object-fit: contain;
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
