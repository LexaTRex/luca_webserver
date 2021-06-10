import styled from 'styled-components';

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;

  & > * {
    margin-bottom: 1rem;
  }
  & > *:last-child {
    margin-bottom: 0;
  }
`;
