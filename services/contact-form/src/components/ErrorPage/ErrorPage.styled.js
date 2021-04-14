import styled from 'styled-components';
import { Media } from 'utils/media';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  height: 100vh;
  width: 100vw;

  padding: 40px 56px;

  ${Media.mobile`
    padding: 24px;
  `}
`;
export const ErrorCard = styled.div`
  width: 100%;

  padding: 40px;
`;
