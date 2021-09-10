import styled from 'styled-components';

export const TableWrapper = styled.div`
  display: flex;
  background-color: white;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  border-bottom: 1px solid lightgray;
  padding: 24px;
  justify-content: space-between;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: rgb(243, 243, 243);
    cursor: pointer;
  }
`;

export const RowWrapper = styled.div`
  display: block;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 550px;
`;

export const Column = styled.div`
  display: flex;
  flex: ${({ flex }) => flex};
  justify-content: ${({ align }) => align || ''};
`;
