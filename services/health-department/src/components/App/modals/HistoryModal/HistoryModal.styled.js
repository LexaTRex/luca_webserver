import styled from 'styled-components';

export const ModalWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const HistoryTitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
`;

export const HistoryOverviewHeadline = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid white;
  padding-bottom: 16px;
`;

export const LocationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0 22px 0;
`;

export const HistoryList = styled.div`
  max-height: 450px;
  overflow: auto;
`;

export const Location = styled.div`
  font-weight: 600;
`;

export const Time = styled.div``;

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const contactStyle = {
  padding: '0 40px',
  color: 'black',
  backgroundColor: 'white',
};

export const contactedStyle = { ...contactStyle, backgroundColor: '#b4b4b4' };

export const completedStyle = { ...contactStyle, backgroundColor: '#d3dec3' };
