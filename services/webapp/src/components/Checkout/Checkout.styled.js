import styled from 'styled-components';

import { AppHeadline } from '../AppLayout';
import { SecondaryButton } from '../Buttons';
import { SmallHeadline, Text } from '../Text';

export const StyledAppHeadline = styled(AppHeadline)`
  overflow: hidden;
  padding-top: 16px;
  text-overflow: ellipsis;
`;
export const StyledLocationInfoContainer = styled.div`
  display: flex;
`;
export const StyledLocationInfoTextContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
export const AdditionalDataText = styled(Text)`
  margin-top: 20px;
`;
export const StyledLocationInfoText = styled(Text)``;
export const StyledNumberOfAccountsOnThisLocation = styled(SmallHeadline)`
  color: #000;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;
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
export const StyledCheckInTimeContainer = styled.div`
  display: flex;
  margin: 16px 0;
  align-items: center;
  justify-content: center;
`;
export const StyledCheckInTime = styled.div``;
export const StyledTime = styled(SmallHeadline)`
  color: #000;
  font-size: 64px;
`;
export const StyledTimeType = styled(Text)`
  color: #000;
  padding: 0 0 0 ${({ isNotHours }) => (isNotHours ? 13 : 0)}px;
`;
export const StyledCheckoutButton = styled(SecondaryButton)`
  width: 100%;
  color: #000;
  height: 56px;
  border: none;
  font-size: 18px;
  padding: 0 40px;
  background-color: #bed4c2;
`;
