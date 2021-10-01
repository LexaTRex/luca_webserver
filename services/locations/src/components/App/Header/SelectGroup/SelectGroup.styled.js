import styled from 'styled-components';
import { Button } from 'antd';

export const StyledButton = styled(Button)`
  border-radius: 24px;
  border: 2px solid #fff;
  color: #fff;
  background: transparent;
  margin-right: 24px;

  &:active,
  &:hover,
  &:focus {
    color: #000;
    background: #fff;
    border-color: #fff;

    .anticon {
      color: #000;
    }
  }
`;
