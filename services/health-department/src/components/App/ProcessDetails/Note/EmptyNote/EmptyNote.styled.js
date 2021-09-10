import styled from 'styled-components';
import { PlusCircleOutlined } from '@ant-design/icons';

export const Title = styled.div`
  color: rgb(80, 102, 124);
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 2px;
`;

export const EmptyNoteWrapper = styled.div`
  display: flex;
  cursor: pointer;
  margin-top: 32px;
  width: fit-content;

  &:hover {
    & div,
    span {
      color: black;
    }
  }
`;

export const PlusCircleNote = styled(PlusCircleOutlined)`
  margin-right: 16px;
  font-size: 26px;
  color: rgb(80, 102, 124);
`;
