import styled from 'styled-components';

const getFontFamily = () => 'font-family: Montserrat-SemiBold, sans-serif';

const getMargin = () => 'margin-bottom: 16px';

const getBorder = hasBorder =>
  hasBorder ? 'border-bottom: 1px solid rgb(151, 151, 151)' : '';

const getTableHeader = isTableHeader =>
  isTableHeader ? 'font-weight: bold' : '';

export const Wrapper = styled.div`
  display: flex;
  width: 700px;
  flex-direction: column;
`;

export const Loading = styled.div`
  font-size: 24px;
  text-align: center;
  margin-top: 24px;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
`;

export const AlignSelfEnd = styled.div`
  align-self: flex-end;
`;

export const Entry = styled.td`
  ${getFontFamily()};
  ${getMargin()};
  ${({ tableHeader }) => getTableHeader(tableHeader)};
  padding: 10px 10px;
  text-align: center;
`;

export const ActiveTableCount = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

export const RefreshTime = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

export const buttonStyles = {
  border: '2px solid rgb(80, 102, 124)',
  fontFamily: 'Montserrat-Bold, sans-serif',
  fontSize: 14,
  fontWeight: 'bold',
  padding: '0 40px',
  color: 'black',
};

export const checkoutButtonStyle = {
  ...buttonStyles,
  border: 'none',
  backgroundColor: 'rgb(195, 206, 217)',
  textTransform: 'uppercase',
};

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
