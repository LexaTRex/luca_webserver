import styled from 'styled-components';

import { Headline, Text } from '../../Text';
import { SecondaryButton } from '../../Buttons';

export const StyledModalContainer = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  background-color: rgba(232, 231, 229, 0.6);
`;
export const StyledContainer = styled.div`
  top: 0;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 60vh;
  margin: auto;
  display: flex;
  padding: 16px 32px;
  border-radius: 7px;
  position: absolute;
  flex-direction: column;
  background-color: #fff;
`;
export const StyledGuestList = styled.div`
  flex: 1;
  padding-top: 8px;
  overflow-x: hidden;
  overflow-y: scroll;
`;
export const StyledContent = styled.div`
  flex: 1;
  display: flex;
  overflow-x: hidden;
  overflow-y: scroll;
  flex-direction: column;
`;
export const StyledHeadline = styled(Headline)`
  max-lines: 1;
  font-size: 24px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
export const StyledInfoText = styled(Text)`
  font-size: 14px;
`;
export const StyledBoldText = styled(Text)`
  font-size: 14px;
  font-weight: bold;
`;
export const StyledCloseButton = styled(SecondaryButton)``;
