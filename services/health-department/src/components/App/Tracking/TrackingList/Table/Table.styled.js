import styled from 'styled-components';

export const TableWrapper = styled.div`
  display: flex;
  background-color: white;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  border-bottom: 1px solid rgb(151, 151, 151);
  padding: 24px;
  justify-content: space-bewteen;
`;

export const RowWrapper = styled.div`
  display: block;
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 550px;
`;

export const Column = styled.div`
  display: flex;
  flex: ${({ flex }) => flex};
  justify-content: ${({ align }) => align || ''};
`;
