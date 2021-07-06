import styled from 'styled-components';

export const ModalWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const HistoryTitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

export const HistoryOverviewHeadline = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 500;
`;

export const LocationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0 22px 0;
`;

export const HistoryList = styled.div`
  max-height: 746px;
  overflow: auto;
`;

export const Label = styled.div`
  font-weight: 600;
`;

export const Time = styled.div`
  width: 100%;
  flex-grow: 1;
  margin: auto 0;
`;

export const Contact = styled.div`
  width: 100%;
  flex-grow: 1;
  margin: auto 0;
`;

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const Row = styled.div`
  display: flex;
  border-bottom: 1px solid rgb(151, 151, 151);
  padding: 24px 0;
`;

export const Column = styled.div`
  display: flex;
  flex: ${({ flex }) => flex};
  justify-content: ${({ align }) => align || ''};
  flex-wrap: ${({ wrap }) => wrap || 'nowrap'};
`;
