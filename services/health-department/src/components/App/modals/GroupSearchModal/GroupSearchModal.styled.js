import styled from 'styled-components';

export const GroupSearchWrapper = styled.div`
  width: 100%;
  background-color: #4e6180;
`;

export const ResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 500px;
  margin-top: 24px;
  overflow-y: auto;
`;

export const Entry = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(151, 151, 151, 0.5);
`;

export const EntryInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EntryName = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

export const EntryAdress = styled.div`
  margin-bottom: 8px;
`;
