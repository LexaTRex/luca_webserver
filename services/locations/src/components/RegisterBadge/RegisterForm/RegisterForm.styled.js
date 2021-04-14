import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 56px;
  background-color: #e8e7e5;
  width: 723px;
  margin: auto;
  @media (max-width: 768px) {
    width: 95%;
    padding: 24px;
  }
`;

export const ContentWrapper = styled.div`
  margin-top: 24px;
`;

export const ContentTitle = styled.div`
  font-size: 20px;
  margin-bottom: 24px;
`;

export const Title = styled.div`
  font-size: 42px;
  font-weight: normal;
  margin-bottom: 16px;
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

export const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: ${({ multipleButtons }) =>
    multipleButtons ? 'space-between' : 'flex-end'};
  margin-top: 32px;
`;

export const SuccessWrapper = styled.div`
  margin: 24px;
`;

export const SubTitle = styled.div`
  margin-bottom: 32px;
`;
