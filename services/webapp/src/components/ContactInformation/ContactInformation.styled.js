import { Form } from 'antd';
import styled, { css } from 'styled-components';

import { Text } from '../Text';
import { SecondaryButton } from '../Buttons';

export const StyledForm = styled(Form)`
  flex: 1;
  padding: 0;
  display: flex;
  overflow-y: scroll;
  overflow-x: hidden;
  flex-direction: column;
`;

export const StyledContent = styled.div`
  flex: 1;
  padding: 0 16px;
  overflow-x: hidden;
  overflow-y: scroll;
`;

export const StyledSaveButton = styled(SecondaryButton)`
  width: 100%;
  height: 48px;
  margin: 8px 0;
  color: rgb(0, 0, 0) !important;
`;

export const StyledPlaceholder = styled.div`
  flex: 1;
`;
export const StyledDescription = styled(Text)`
  color: #fff;
  margin: 0 0 8px;
`;
export const StyledLink = styled.button`
  padding: 0;
  color: #fff;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  letter-spacing: 0.25px;
  background-color: transparent;
  font-family: Montserrat-SemiBold, sans-serif;

  ${({ isCentered }) =>
    isCentered
      ? css`
          margin: 0 0 8px;
          text-align: center;
        `
      : css`
          margin: 0 0 8px;
          text-align: left;
        `}
`;

export const StyledFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
