import styled from 'styled-components';

export const Info = styled.div`
  margin-bottom: 24px;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
`;

export const HiddenUpload = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  z-index: 2;
`;
