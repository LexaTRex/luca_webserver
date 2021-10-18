import styled from 'styled-components';

export const InnerForm = styled.div`
  display: ${({ show }) => (show ? 'flex' : 'none')};
`;

export const FormColum = styled.div`
  flex-basis: 100%;
`;
