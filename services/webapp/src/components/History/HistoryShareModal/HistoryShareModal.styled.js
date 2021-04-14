import styled from 'styled-components';

import { Headline, Text } from '../../Text';
import { SecondaryButton } from '../../Buttons';

export const StyledModalContainer = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.4);
`;
export const StyledContainer = styled.div`
  top: 0;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 50vh;
  margin: auto;
  display: flex;
  padding: 24px 8px;
  border-radius: 7px;
  position: absolute;
  flex-direction: column;
  background-color: #fff;
`;
export const StyledContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
export const StyledTanHeadline = styled(Headline)`
  font-size: 24px;
`;
export const StyledTanInfoText = styled(Text)`
  font-size: 18px;
`;
export const StyledTan = styled(Text)`
  flex: 1;
  display: flex;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  align-items: center;
  justify-content: center;
`;
export const StyledCloseButton = styled(SecondaryButton)``;
