import styled from 'styled-components';
import { BellOutlined } from '@ant-design/icons';

export const Wrapper = styled.div`
  display: flex;
  margin-left: auto;
`;

export const StyledLink = styled.a`
  color: rgb(80, 102, 124);
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
`;

export const BellOutlinedIcon = styled(BellOutlined)`
  margin-right: 9px;
`;
