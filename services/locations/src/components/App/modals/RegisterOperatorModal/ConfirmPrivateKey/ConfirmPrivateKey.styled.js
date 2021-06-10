import styled from 'styled-components';

const font = 'Montserrat-Bold, sans-serif';

export const Expand = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 1000ms;
  height: ${({ open }) => (open ? '200px' : '0')};
  border-top: ${({ open }) => (open ? '1px solid rgb(151, 151, 151)' : '')};
  margin-top: ${({ open }) => (open ? '32px' : '')};
  overflow: hidden;
`;

export const DownloadTitle = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: ${font};
  font-size: 16px;
  font-weight: 500;
`;

export const Explain = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 32px;
`;
