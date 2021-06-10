import styled from 'styled-components';

import { Text } from '../Text';

export const StyledInfoText = styled(Text)`
  top: 5px;
  left: 9px;
  font-size: 14px;
  user-select: none;
  line-height: 14px;
  position: absolute;
  color: ${({ inverted }) => (inverted ? '#fff' : '#000')};
`;
export const StyledContainer = styled.button`
  padding: 0;
  width: 24px;
  height: 24px;
  outline: none;
  margin: 0 8px;
  display: block;
  position: relative;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: 1px solid ${({ inverted }) => (inverted ? '#fff' : '#000')};

  &:hover,
  &:active {
    background-color: rgb(0, 0, 0);
  }

  &:hover > ${StyledInfoText} {
    color: rgb(255, 255, 255) !important;
  }
  &:active > ${StyledInfoText} {
    color: rgb(255, 255, 255) !important;
  }
`;
