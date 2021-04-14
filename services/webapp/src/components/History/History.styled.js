import { Steps } from 'antd';
import styled, { css } from 'styled-components';

import { AppContent } from '../AppLayout';
import { SecondaryButton } from '../Buttons';
import { SmallHeadline, Text } from '../Text';

export const StyledHistoryStepContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
export const StyledHistoryInfoContainer = styled.div`
  width: 100%;
  display: flex;
`;

export const StyledFooterContainer = styled.div`
  flex: 1;
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  color: rgb(255, 255, 255);
`;
export const StyledFooterItem = styled(SmallHeadline)`
  flex: 1;
  width: 75px;
  display: flex;
  font-size: 10px;
  font-weight: 600;
  padding-top: 8px;
  line-height: 30px;
  text-align: center;
  align-items: center;
  flex-direction: column;
  color: rgb(195, 206, 217);
  justify-content: flex-start;
  ${({ isActive }) =>
    isActive &&
    css`
      margin-top: -1px;
      border-top: 1px solid #fff;
    `}
`;
export const StyledSteps = styled(Steps)`
  margin: 16px 0 0;

  .ant-steps-item-title {
    padding: 0;
    width: 100%;
  }
`;
export const StyledSecondaryButton = styled(SecondaryButton)`
  width: 100%;
  height: 36px;
  margin: 12px 0;
  max-width: 296px;
`;
export const StyledAddButton = styled(SecondaryButton)`
  width: 100%;
  height: 36px;
  max-width: 296px;
  margin-top: 12px;
  color: rgb(184, 192, 202);
  border: 2px solid rgb(184, 192, 202);
  background-color: rgba(227, 225, 221, 0.1);

  &:focus,
  &:active {
    color: rgb(184, 192, 202);
    border: 2px solid rgb(184, 192, 202);
    background-color: rgba(227, 225, 221, 0.1);
  }
`;
export const StyledNumberOfDataAccessContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
export const StyledNumberOfDataAccessInfoText = styled(Text)`
  flex: 1;
  display: block;
  font-weight: bold;
  color: rgb(255, 255, 255);
`;
export const StyledFooter = styled(AppContent)`
  flex: unset;
  padding: 0 8px;
`;
export const StyledNumberOfDataAccess = styled(SmallHeadline)`
  font-weight: bold;
`;
export const StyledHistoryTitle = styled(Text)`
  color: rgb(255, 255, 255);
`;
export const StyledHistoryInfoTitle = styled(Text)`
  flex: 1;
  color: rgb(255, 255, 255);
`;
export const StyledHistoryContent = styled(Text)`
  font-weight: bold;
  color: rgb(255, 255, 255);
`;
