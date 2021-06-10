import { Button } from 'antd';
import styled from 'styled-components';

export const SecondaryButton = styled(Button)`
  border-width: 0 !important;
  background: rgb(184, 192, 202);
  color: rgb(0, 0, 0);
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  line-height: 26.3px;
  font-family: Montserrat-SemiBold, sans-serif;

  &[disabled] {
    color: rgba(0, 0, 0, 0.25) !important;
  }
`;
