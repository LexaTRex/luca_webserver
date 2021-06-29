import styled from 'styled-components';
import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export const StyledSearchOutlined = styled(SearchOutlined)`
  color: gray;
`;
export const DescriptionText = styled.div`
  font-family: Montserrat-Medium, sans-serif;
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

export const SubmitButton = styled(Button)`
  font-family: Montserrat-Medium, sans-serif;
  color: rgba(0, 0, 0, 0.87);
  background-color: rgb(195, 206, 217);
  font-weight: bold;
  height: 40px;
  float: right;
  text-transform: uppercase;
  padding: 0 24px;
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

export const ResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 500px;
  margin-top: 24px;
  overflow-y: auto;
`;

export const Entry = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  border-bottom: 1px solid rgba(151, 151, 151, 0.5);

  &:hover {
    background-color: rgb(243, 243, 243);
    cursor: pointer;
  }
`;

export const EntryInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EntryName = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

export const EntryAdress = styled.div`
  margin-bottom: 8px;
`;
