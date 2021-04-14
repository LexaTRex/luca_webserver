import styled from 'styled-components';

export const ScannerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  height: 100vh;
  width: 100vw;
  padding: 40px 56px;
  @media (max-width: 768px) {
    padding: 8px 16px;
  }
`;
