import styled from 'styled-components';

export const Explain = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 32px;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: ${({ align }) => align};
  margin-top: 80px;
`;

export const DownloadRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
