import styled from 'styled-components';

export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 0 32px;
  height: 100%;
  overflow: auto;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
`;

export const TableHeader = styled.div`
  display: flex;
  border-bottom: 1px solid rgb(151, 151, 151);
  padding: 24px 0 24px 24px;
  justify-content: space-between;
  font-weight: bold;
`;

export const Row = styled.div`
  display: flex;
  border-bottom: 1px solid rgb(151, 151, 151);
  padding: 24px 0 24px 24px;
  justify-content: space-between;
  white-space: pre;
  & mark + mark {
    margin-inline-start: 7px;
  }
`;

export const Column = styled.div`
  display: flex;
  padding: 0 16px;
  flex: ${({ flex }) => flex};
  justify-content: ${({ align }) => align || ''};
`;
