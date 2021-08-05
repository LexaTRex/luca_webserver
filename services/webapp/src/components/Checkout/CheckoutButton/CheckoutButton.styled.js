import styled from 'styled-components';
import { SecondaryButton } from 'components/Buttons';

export const CheckoutButtonWrapper = styled.div`
  flex: 1;
  display: flex;
  padding: 0 16px;
  overflow-y: scroll;
  overflow-x: hidden;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledButton = styled(SecondaryButton)`
  width: 100%;
  color: #000;
  height: 56px;
  border: none;
  font-size: 18px;
  padding: 0 40px;
  background-color: #bed4c2;
`;
