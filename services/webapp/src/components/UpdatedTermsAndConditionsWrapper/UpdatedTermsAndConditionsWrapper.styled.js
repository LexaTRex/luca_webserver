import styled from 'styled-components';

import { SecondaryButton } from 'components/Buttons';
import { Headline, Link, Text } from 'components/Text';

export const StyledLucaLogo = styled.img`
  width: 87px;
  height: 48px;
  user-select: none;
`;

export const StyledHeadline = styled(Headline)`
  width: 100%;
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

export const StyledPlaceholder = styled.div`
  flex: 1;
`;

export const StyledPrimaryButton = styled(SecondaryButton)`
  width: 100%;
  height: 48px;
  margin-top: 12px;
`;

export const StyledLink = styled(Link)`
  color: #ffffff;
  text-decoration: underline;
`;

export const StyledMenuIcon = styled.img`
  height: 4px;
  width: 20px;
`;

export const StyledHeaderMenuIconContainer = styled.button`
  flex: 1;
  margin: 0;
  border: none;
  display: flex;
  outline: none;
  padding: 20px 0;
  align-items: center;
  justify-content: flex-end;
  background-color: transparent;
`;
