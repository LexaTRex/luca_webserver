import styled from 'styled-components';
import { SmallHeadline, Text } from 'components/Text';

export const StyledLocationInfoContainer = styled.div`
  display: flex;
  padding-left: 20px;
`;

export const StyledLocationInfoText = styled(Text)``;

export const StyledLocationInfoTextContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const StyledNumberOfAccountsOnThisLocation = styled(SmallHeadline)`
  color: #000;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;
