import styled from 'styled-components';
import { Media } from 'utils/media';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  height: 100vh;
  width: 100vw;
  padding: 40px 56px;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  @media (max-width: 900px) and (orientation: landscape) {
    align-items: stretch;
    justify-content: flex-end;
  }
`;

export const LoadingCard = styled.div`
  max-width: 50%;
  margin-left: -150px;
  padding: 40px;
  background: transparent;
  border-radius: 2px;
  width: 624px;

  ${Media.mobile`
    width: 100%;
    max-width: none;

    max-height: 70%;
    overflow-y: scroll;

    padding: 24px 24px 32px;
    margin: 16px 32px 0;
  `}
`;

export const Loading = styled.div`
  font-size: 24px;
  color: red;
  text-align: center;
`;
