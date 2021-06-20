import styled from 'styled-components';
import { Media } from 'utils/media';

export const inputStyle = {
  border: '1px solid #696969',
  backgroundColor: 'transparent',
};

export const Criteria = styled.div`
  display: flex;
  margin-bottom: 4px;
  ${Media.mobile`
    display: none;
  `}
`;
export const CriteriaIcon = styled.div`
  margin-right: 4px;
`;

export const CriteriaText = styled.div``;
