import styled from 'styled-components';

export const NoRequests = styled.div`
  height: 65vh;
`;

export const Wrapper = styled.div`
  padding: 24px 32px 32px 32px;
  background-color: ${({ inComplete }) =>
    inComplete ? 'rgb(254, 215, 187)' : 'white'};
  margin-bottom: 24px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  font-weight: 500;
`;
