import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
`;

export const ListWrapper = styled.div`
  padding: 8px 0;
  margin: 0 0 16px 42px;
  border-bottom: 1px solid rgb(151, 151, 151);
`;

export const Location = styled.div`
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 8px 0 8px 42px;
  margin-left: -42px;
  background: ${({ isActiveLocation }) =>
    isActiveLocation ? 'rgb(195, 206, 217)' : ''};
  font-weight: ${({ isActiveLocation }) => (isActiveLocation ? '600' : '500')};
  font-family: ${({ isActiveLocation }) =>
    isActiveLocation
      ? 'Montserrat-Bold, sans-serif'
      : 'Montserrat, sans-serif'};
`;
