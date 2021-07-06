import styled from 'styled-components';

import { Headline, Text } from '../../Text';
import { SecondaryButton } from '../../Buttons';

export const StyledModalContainer = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.4);
`;
export const StyledContainer = styled.div`
  top: 0;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 60vh;
  margin: auto;
  display: flex;
  max-width: 520px;
  max-height: 80vh;
  padding: 24px 16px;
  border-radius: 7px;
  position: absolute;
  flex-direction: column;
  background-color: #fff;
`;
export const StyledContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
export const StyledHeadline = styled(Headline)`
  flex-grow: 1;
  font-size: 24px;
`;
export const StyledInfoText = styled(Text)`
  flex-grow: 2;
  font-size: 18px;
`;
export const StyledFooter = styled.div`
  height: 45px;
  display: flex;
  padding-top: 20px;
  justify-content: space-between;
`;
export const StyledCancelButton = styled(SecondaryButton)`
  float: left;
  width: 40%;
`;
export const StyledShareButton = styled(SecondaryButton)`
  float: right;
  width: 40%;
`;
