import styled from 'styled-components';

export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TableHeader = styled.div`
  display: flex;
  border-bottom: 1px solid rgb(151, 151, 151);
  padding: 24px 0;
  justify-content: space-between;
  font-weight: bold;
`;

export const Row = styled.div`
  display: flex;
  border-bottom: 1px solid rgb(151, 151, 151);
  padding: 24px 0;
  justify-content: space-between;
  white-space: pre;
  & mark + mark {
    margin-inline-start: 7px;
  }
`;

export const Column = styled.div`
  display: flex;
  flex: ${({ flex }) => flex};
  justify-content: ${({ align }) => align || ''};
`;
