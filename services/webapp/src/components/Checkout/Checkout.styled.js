import styled, { css } from 'styled-components';

import { AppHeadline } from 'components/AppLayout';
import { SecondaryButton } from 'components/Buttons';
import { Text } from 'components/Text';

export const StyledAppHeadline = styled(AppHeadline)`
  overflow: hidden;
  padding: 4px 0 0;
  text-overflow: ellipsis;
`;

export const StyledLocationInfoText = styled(Text)``;

export const AddNewPersonButton = styled(SecondaryButton)`
  width: 100%;
  height: 36px;
  max-width: 296px;
  margin-top: 12px;
  color: rgb(0, 0, 0);
  background-color: transparent;
  border: 1px solid rgb(0, 0, 0);

  &:focus,
  &:active {
    color: rgb(184, 192, 202);
    border: 2px solid rgb(184, 192, 202);
    background-color: rgba(227, 225, 221, 0.1);
  }
`;

export const StyledInfoText = styled(Text)`
  color: #000;
  padding-top: 8px;
`;

export const StyledWrapper = styled.div`
  flex: ${({ flex = 1 }) => flex};
  display: flex;
  padding: 0 ${({ noPadding }) => (noPadding ? 0 : 16)}px;
  overflow-y: scroll;
  overflow-x: hidden;
  flex-direction: column;
  ${({ isCentered }) =>
    !isCentered &&
    css`
      align-items: center;
      justify-content: center;
    `}
`;
