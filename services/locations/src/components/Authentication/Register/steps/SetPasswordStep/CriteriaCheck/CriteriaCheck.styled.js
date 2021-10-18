import styled from 'styled-components';
import { Media } from 'utils/media';

export const Criteria = styled.div`
  display: flex;
  margin-bottom: 4px;
  color: ${({ passedCriteria }) => (passedCriteria ? 'rgb(108, 132, 72)' : '')};
  ${Media.mobile`
    display: none;
  `};
`;

export const CriteriaIcon = styled.div`
  margin-right: 4px;
`;
