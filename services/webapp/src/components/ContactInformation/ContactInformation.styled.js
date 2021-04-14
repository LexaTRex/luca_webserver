import { Form } from 'antd';
import styled, { css } from 'styled-components';
import { SecondaryButton } from '../Buttons';
import { Text, Link } from '../Text';

export const StyledForm = styled(Form)`
  flex: 1;
  display: flex;
  padding: 0 16px;
  overflow-y: scroll;
  overflow-x: hidden;
  flex-direction: column;
`;

export const StyledContent = styled.div`
  flex: 1;
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
export const StyledLink = styled(Link)`
  color: #fff;
  ${({ isCentered }) =>
    isCentered
      ? css`
          margin: 8px 0 0;
          text-align: center;
        `
      : css`
          margin: 0 0 8px;
        `}
`;

export const StyledFooter = styled.div`
  width: 100%;
  display: flex;
`;
