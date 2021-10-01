import styled from 'styled-components';

import { Media } from 'utils/media';

export const Wrapper = styled.div`
  width: 750px;
  display: flex;
  flex-direction: column;

  ${Media.tablet`
    width: 80vw;
  `}
`;
export const StepHeadline = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: rgb(0, 0, 0);
  font-family: Montserrat-SemiBold, sans-serif;
`;
export const StepDescription = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Medium, sans-serif;
`;
export const StepFooter = styled.div`
  width: 100%;
  display: flex;
  padding: 16px 0;
  flex-direction: row;
`;
export const StepFooterLeft = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
`;
export const StepFooterRight = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
`;
