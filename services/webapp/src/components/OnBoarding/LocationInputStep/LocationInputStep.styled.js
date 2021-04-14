import { Form } from 'antd';
import styled from 'styled-components';

import { SmallHeadline, Text } from '../../Text';
import { SecondaryButton } from '../../Buttons';

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
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 32px;
`;

export const StyledInfoText = styled(Text)`
  padding: 8px 0;
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
`;

export const StyledFooter = styled.div`
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
