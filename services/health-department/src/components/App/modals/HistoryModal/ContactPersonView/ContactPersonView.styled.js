import styled from 'styled-components';

export const ContactViewWrapper = styled.div`
  position: absolute;

  left: -280px;
  top: -180px;
  right: -280px;

  background-color: white;

  outline: 20px solid #4e6180;

  z-index: 10;
`;

export const HeaderArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 24px 32px 24px;
`;

export const DateDisplay = styled.p`
  color: black;
`;

export const TableWrapper = styled.div`
  display: flex;
  background-color: white;
  color: black;
  flex-direction: column;
  max-height: 390px;
  overflow: auto;
`;

export const TableHeader = styled.div`
  display: flex;
  border-bottom: 1px solid rgb(151, 151, 151);
  padding: 24px 24px;
  font-weight: bold;
`;

export const Row = styled.div`
  display: flex;
  border-bottom: 1px solid rgb(151, 151, 151);
  padding: 24px 0;
  margin: 0 24px;
`;

export const Column = styled.div`
  display: flex;
  flex: ${({ flex }) => flex};
  justify-content: ${({ align }) => align || ''};
`;
