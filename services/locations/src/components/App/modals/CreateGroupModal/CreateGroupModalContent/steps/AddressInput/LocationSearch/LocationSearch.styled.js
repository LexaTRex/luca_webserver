import styled from 'styled-components';
import { Input } from 'antd';

export const StyledInput = styled(Input)`
  border-radius: 0;
  border: none;
  box-shadow: none;
  border-bottom: 1px solid rgb(151, 151, 151);
  :focus {
    box-shadow: none;
  }
`;
