import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  min-width: 375px;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Count = styled.div`
  flex: 1;
  display: flex;
  margin-bottom: 24px;
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  font-weight: 500;
`;

export const Loading = styled.div`
  font-size: 24px;
  text-align: center;
  margin-top: 24px;
`;
