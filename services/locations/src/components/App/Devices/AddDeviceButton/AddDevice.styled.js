import styled from 'styled-components';

export const AddDeviceWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${({ isCentered }) => (isCentered ? 'center' : 'flex-end')};
`;
