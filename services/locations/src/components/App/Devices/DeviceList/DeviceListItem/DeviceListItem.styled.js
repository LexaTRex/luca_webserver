import styled from 'styled-components';

export const DeviceListItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 16px;
`;
export const DeviceValue = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Medium, sans-serif;
`;
export const DeleteDeviceAction = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  box-shadow: none;
  font-weight: bold;
  color: rgb(80, 102, 124);
  background-color: transparent;
  font-family: Montserrat-Bold, sans-serif;
`;
export const ReactivateDeviceAction = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  box-shadow: none;
  font-weight: bold;
  color: rgb(80, 102, 124);
  background-color: transparent;
  font-family: Montserrat-Bold, sans-serif;
`;
