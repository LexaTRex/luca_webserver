import { Button } from 'antd';
import styled from 'styled-components';

export const DatePickerRow = styled.div`
  display: flex;
`;

export const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;

export const BackButton = styled(Button)`
  font-family: Montserrat-Medium, sans-serif;
  border: 2px solid rgb(80, 102, 124);
  color: rgba(0, 0, 0, 0.87);
  background: transparent;
  font-weight: bold;
  text-transform: uppercase;
  height: 40px;
  padding: 0 24px;
`;

export const OpenProcessButton = styled(Button)`
  font-family: Montserrat-Medium, sans-serif;
  color: rgba(0, 0, 0, 0.87);
  background-color: rgb(195, 206, 217);
  font-weight: bold;
  text-transform: uppercase;
  height: 40px;
  padding: 0 24px;
`;

export const GroupText = styled.div`
  font-family: Montserrat-Medium, sans-serif;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: bold;
`;

export const InfoText = styled.div`
  font-family: Montserrat-Medium, sans-serif;
  margin-bottom: 24px;
  font-size: 16px;
  font-weight: bold;
`;

export const AddressText = styled.div`
  font-family: Montserrat-Medium, sans-serif;
  margin-bottom: 24px;
  font-size: 14px;
  color: gray;
`;

export const DateText = styled.div`
  font-family: Montserrat-Medium, sans-serif;
  color: black;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
`;

export const DateSelectorWrapper = styled.div`
  width: 46%;
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
`;
