import styled from 'styled-components';
import { Media } from 'utils/media';

export const Wrapper = styled.div`
  display: flex;
  justify-content: ${({ multipleButtons }) =>
    multipleButtons ? 'space-between' : 'flex-end'};
  margin-top: 24px;

  ${Media.mobile`
    margin-top: 40px;
    flex-direction: column;
  `}
`;
