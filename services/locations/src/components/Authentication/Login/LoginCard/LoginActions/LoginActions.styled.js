import styled from 'styled-components';

import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';

export const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const Divider = styled.div`
  margin: 24px 0;
  border-bottom: 1px solid rgb(0, 0, 0);
`;

export const StyledPrimaryButton = styled(PrimaryButton)`
  width: 268px;
  background-color: white;
`;

export const StyledSecondaryButton = styled(SecondaryButton)`
  width: 268px;
`;
