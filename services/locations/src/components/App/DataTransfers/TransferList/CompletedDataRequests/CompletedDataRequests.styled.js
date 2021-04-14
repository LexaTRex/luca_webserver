import styled from 'styled-components';

export const TableHeader = styled.div`
  display: flex;
  padding: 32px 32px 16px 32px;
  margin: 0 -32px;
  border-bottom: 1px solid rgb(151, 151, 151);
`;

export const TableHeaderEntry = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-SemiBold, sans-serif;
  font-size: 14px;
  font-weight: 600;
`;

export const TableRow = styled.div`
  display: flex;
  padding: 32px 0 16px 0;
  border-bottom: 1px solid rgb(218, 224, 231);
`;

export const TableEntry = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Medium, sans-serif;
  font-size: 14px;
  font-weight: 500;
`;
