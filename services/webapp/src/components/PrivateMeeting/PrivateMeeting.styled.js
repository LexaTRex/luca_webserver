import styled from 'styled-components';

import { Text } from '../Text';
import { AppContent } from '../AppLayout';
import { PrimaryButton } from '../Buttons';

export const StyledHeader = styled(AppContent)`
  flex-direction: row;
`;
export const StyledFooter = styled(AppContent)`
  padding: 12px 0;
`;
export const StyledQRCodeWrapper = styled.div`
  padding: 8px;
  background-color: #ffffff;
`;
export const StyledInfoText = styled(Text)`
  flex: 1;
`;
export const StyledCloseButton = styled(PrimaryButton)`
  width: 90%;
  height: 38px;
`;
