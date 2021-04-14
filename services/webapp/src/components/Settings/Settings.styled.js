import styled from 'styled-components';
import { SecondaryButton } from '../Buttons';

export const StyledSettingsButton = styled(SecondaryButton)`
  border: 0;
  width: 100%;
  margin: 4px 0;
  padding-left: 0;
  border-radius: 0;
  font-weight: 500;
  text-align: left;
  color: rgb(255, 255, 255);
  background-color: transparent;
  border-bottom: 1px solid rgb(151, 151, 151);

  &:active,
  &:focus,
  &:hover {
    background-color: transparent;
    color: rgb(255, 255, 255);
  }
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

export const StyledBackButton = styled(SecondaryButton)`
  margin: 8px;
  width: 100%;
  height: 48px;
  color: rgb(0, 0, 0) !important;
`;
