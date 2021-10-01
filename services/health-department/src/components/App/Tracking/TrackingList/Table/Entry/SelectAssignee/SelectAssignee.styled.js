import styled from 'styled-components';
import { Select } from 'antd';

export const StyledSelect = styled(Select)`
  width: 180px;
  display: flex;
  align-self: baseline;

  & .ant-select-selector {
    cursor: pointer !important;
  }
`;
