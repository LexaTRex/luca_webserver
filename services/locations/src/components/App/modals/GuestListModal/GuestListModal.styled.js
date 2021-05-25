import { Button } from 'antd';
import styled from 'styled-components';

const getFontFamily = isHeadline =>
  isHeadline ? 'font-family: Montserrat-SemiBold, sans-serif' : '';

const getMargin = isHeadline => (isHeadline ? 'margin-bottom: 16px' : '');

const getBorder = hasBorder =>
  hasBorder ? 'border-bottom: 1px solid rgb(151, 151, 151)' : '';

const getTableHeader = isTableHeader =>
  isTableHeader ? 'font-weight: bold' : '';

export const Wrapper = styled.div`
  display: flex;
  min-width: 375px;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Count = styled.div`
  flex: 1;
  display: flex;
  margin-bottom: 24px;
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Medium, sans-serif;
  font-size: 16px;
  font-weight: 500;
`;

export const GuestTable = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
`;

export const TableRow = styled.tr`
  padding: 5px 0px;
  text-align: center;
  ${({ borderBottom }) => getBorder(borderBottom)};
`;

export const Entry = styled.td`
  ${({ headline }) => getFontFamily(headline)};
  ${({ headline }) => getMargin(headline)};
  ${({ tableHeader }) => getTableHeader(tableHeader)};
  padding: 10px 10px;
  text-align: center;
`;

export const Loading = styled.div`
  font-size: 24px;
  text-align: center;
  margin-top: 24px;
`;

export const CheckoutButton = styled(Button)`
  font-size: 14px;
  padding: 0 40px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.87);
  background-color: rgb(195, 206, 217);
  font-family: Montserrat-Bold, sans-serif;
`;
