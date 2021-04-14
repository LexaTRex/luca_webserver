import { Checkbox } from 'antd';
import styled from 'styled-components';

import { Text } from '../Text';

export const StyledContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
`;
export const StyledContent = styled.div`
  flex: 1;
  padding-left: 8px;
`;
export const StyledText = styled(Text)`
  color: #fff;
  font-size: 12px;
`;
export const StyledCheckbox = styled(Checkbox)``;
