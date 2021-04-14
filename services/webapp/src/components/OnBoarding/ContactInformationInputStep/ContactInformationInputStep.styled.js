import styled, { css } from 'styled-components';

import { Form } from 'antd';
import { SecondaryButton } from '../../Buttons';
import { SmallHeadline, Text, Link } from '../../Text';

export const StyledForm = styled(Form)`
  flex: 1;
  display: flex;
  overflow-x: hidden;
  overflow-y: scroll;
  box-sizing: border-box;
  flex-direction: column;
  background-color: #000;
  padding: 32px 32px 0 32px;
`;
export const StyledContent = styled.div`
  flex: 1;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 32px;
`;
export const StyledHeadline = styled(SmallHeadline)`
  margin: 32px 0 0;
`;
export const StyledInfoText = styled(Text)`
  padding: 8px 0;
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
`;
export const StyledSecondaryButton = styled(SecondaryButton)`
  width: 100%;
  height: 48px;
  margin-top: 12px;
  color: rgb(0, 0, 0) !important;
`;
export const StyledFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: ${({ showCancel }) => (showCancel ? 100 : 72)}px;
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

export const SpinWrapper = styled.div`
  text-align: center;
  margin-top: 80px;
`;
