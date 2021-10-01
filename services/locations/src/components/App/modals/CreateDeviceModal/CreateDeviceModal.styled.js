import styled from 'styled-components';

import { Media } from 'utils/media';

export const Wrapper = styled.div`
  width: 750px;
  height: 400px;
  display: flex;
  overflow: hidden;
  flex-direction: column;

  ${Media.tablet`
    width: 80vw;
  `}
`;
