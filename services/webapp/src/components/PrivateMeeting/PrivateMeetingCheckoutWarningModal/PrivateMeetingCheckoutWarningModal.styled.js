import styled from 'styled-components';

import { Headline, Text } from '../../Text';
import { PrimaryButton, SecondaryButton } from '../../Buttons';

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
  height: 75vh;
  margin: auto;
  display: flex;
  padding: 16px 32px;
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
export const StyledHeadline = styled(Headline)`
  font-size: 24px;
`;
export const StyledInfoText = styled(Text)`
  font-size: 14px;
`;
export const StyledFooter = styled.div`
  display: flex;
`;
export const StyledFooterPlaceholder = styled.div`
  flex: 1;
`;
export const StyledSubmitButton = styled(SecondaryButton)`
  margin-top: 8px;
`;
export const StyledCancelButton = styled(PrimaryButton)`
  margin-top: 8px;
`;
