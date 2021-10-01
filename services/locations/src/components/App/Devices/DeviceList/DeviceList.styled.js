import styled from 'styled-components';

export const DeviceListWrapper = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  margin: 32px 0;
  border-radius: 8px;
  flex-direction: column;
  background: rgb(255, 255, 255);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
`;
export const DeviceListHeader = styled.div`
  width: 100%;
  font-size: 18px;
  font-weight: bold;
  line-height: 20px;
  color: rgb(0, 0, 0);
  padding: 24px 32px 32px;
  font-family: Montserrat-SemiBold, sans-serif;
`;
export const DeviceListColumnsWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 16px 32px;
  flex-direction: row;
  border-bottom: 1px solid rgb(151, 151, 151);
`;
export const DeviceListColumn = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-SemiBold, sans-serif;
`;
export const DeviceListContent = styled.div`
  flex: 1;
  display: flex;
  overflow-y: auto;
  overflow-x: hidden;
  flex-direction: column;
  padding: 24px 32px 32px;
`;
