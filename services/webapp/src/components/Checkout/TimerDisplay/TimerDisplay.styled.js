import styled from 'styled-components';
import { SmallHeadline, Text } from 'components/Text';

export const TimeContainer = styled.div`
  display: flex;
  margin: 16px 0;
  align-items: center;
  justify-content: center;
`;

export const StyledTime = styled(SmallHeadline)`
  color: #000;
  font-size: 64px;
`;

export const StyledTimeType = styled(Text)`
  color: #000;
  padding: 0 0 0 ${({ isHours }) => (isHours ? 13 : 0)}px;
`;
