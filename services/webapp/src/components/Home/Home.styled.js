import styled, { css } from 'styled-components';

import { SecondaryButton } from '../Buttons';
import { SmallHeadline, Text } from '../Text';

export const StyledLucaLogo = styled.img`
  width: 87px;
  height: 48px;
  user-select: none;
`;
export const StyledMenuIcon = styled.img`
  height: 4px;
  width: 20px;
`;
export const StyledHeaderMenuIconContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
export const StyledQRCodeWrapper = styled.div`
  padding: 8px;
  background-color: #ffffff;
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
export const StyledQRCodeInfoContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
export const StyledQRCodeCounter = styled(SmallHeadline)`
  color: rgb(211, 222, 195);
`;
export const StyledQRCodeInfo = styled(Text)`
  flex: 1;
  display: block;
  text-align: center;
  margin-bottom: 16px;
  color: rgb(255, 255, 255);
`;
export const StyledSecondaryButton = styled(SecondaryButton)`
  width: 100%;
  height: 36px;
  margin: 12px 0;
  max-width: 296px;
`;
export const StyledPrivateMeetingButton = styled(SecondaryButton)`
  width: 100%;
  height: 36px;
  margin: 12px 0;
  max-width: 296px;
  background: rgb(129, 142, 161);
  border: 2px solid rgb(129, 142, 161);
`;
export const StyledAddButton = styled(SecondaryButton)`
  width: 100%;
  height: 36px;
  max-width: 296px;
  margin: 12px 0;
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
