import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  padding: 40px;
  background-color: #b8c0ca;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;
