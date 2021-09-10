import styled from 'styled-components';
import Icon from '@ant-design/icons';

import { ReactComponent as BellSvg } from 'assets/Bell.svg';

export const ButtonWrapper = styled.div`
  text-align: left;
`;

export const BellIcon = styled(Icon).attrs({ component: BellSvg })`
  color: black;
  font-size: 32px;
  margin-left: 32px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? '50%' : '100%')};
`;
