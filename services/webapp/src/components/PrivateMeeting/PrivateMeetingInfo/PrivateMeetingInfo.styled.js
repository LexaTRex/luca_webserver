import styled from 'styled-components';

import { Text } from '../../Text';

export const StyledContainer = styled.div`
  display: flex;
  padding: 0 32px;
  flex-direction: row;
  box-sizing: border-box;
`;
export const StyledSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
export const StyledHeadline = styled(Text)`
  display: flex;
  font-size: 14px;
`;
export const StyledText = styled(Text)`
  font-size: 22px;
  font-weight: bold;
`;
