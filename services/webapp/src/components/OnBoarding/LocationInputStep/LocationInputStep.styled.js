import { Form } from 'antd';
import styled from 'styled-components';

import { SecondaryButton } from 'components/Buttons';
import { SmallHeadline, Text } from 'components/Text';

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

export const StyledContent = styled.main`
  flex: 1;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 32px;
`;

export const StyledInfoText = styled(Text)`
  color: #fff;
  padding: 8px 0;
  display: block;
  font-size: 14px;
`;

export const StyledFooter = styled.footer`
  height: 72px;
`;

export const StyledHeadline = styled(SmallHeadline)`
  margin: 32px 0 0;
`;

export const StyledSecondaryButton = styled(SecondaryButton)`
  width: 100%;
  height: 48px;
  margin-top: 12px;
  color: rgb(0, 0, 0) !important;
`;
