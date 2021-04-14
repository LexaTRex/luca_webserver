import styled, { css } from 'styled-components';
import { LucaStyledHeadline } from '../Text';

export const StyledContainer = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  background: ${({ bgColor }) => bgColor};
`;
export const StyledHeader = styled.div`
  height: 82px;
  display: flex;
  margin: 0 0 8px;
  padding: 8px 16px 0;
  align-items: center;
  border-bottom: 1px solid rgb(151, 151, 151);
`;
export const AppHeadline = styled(LucaStyledHeadline)`
  font-size: 36px;
  overflow: hidden;
  font-weight: normal;
  text-overflow: ellipsis;
  color: ${({ color = '#fff' }) => color};
`;
export const AppContent = styled.div`
  flex: ${({ flex = 1 }) => flex};
  display: flex;
  padding: 0 ${({ noPadding }) => (noPadding ? 0 : 16)}px;
  overflow-y: scroll;
  overflow-x: hidden;
  flex-direction: column;
  ${({ noCentering }) =>
    !noCentering &&
    css`
      align-items: center;
      justify-content: center;
    `}
`;
export const StyledFooter = styled.div`
  height: 64px;
  display: flex;
  padding: 0 16px;
  border-top: 1px solid rgb(151, 151, 151);
`;
