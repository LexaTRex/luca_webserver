import styled from 'styled-components';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export const StyledSearchOutlined = styled(SearchOutlined)`
  color: gray;
`;
export const DescriptionText = styled.div`
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 24px;
`;

export const GroupSearchInput = styled(Input)`
  border-left: none;
  border-right: none;
  border-top: none;
  border-radius: 0;
`;

export const ZipCodeInput = styled(Input)`
  border-left: none;
  border-right: none;
  border-top: none;
  border-radius: 0;
`;

export const GroupSearchWrapper = styled.div`
  width: 100%;
  background-color: #ffffff;
  padding-bottom: 24px;
`;

export const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
