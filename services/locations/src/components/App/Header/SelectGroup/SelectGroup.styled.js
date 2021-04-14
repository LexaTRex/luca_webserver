import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const StyledLink = styled(Link)`
  text-decoration: none;
  padding: 8px;
  color: #000000 !important;

  &:active,
  &:focus,
  &:hover {
    color: #000000 !important;
  }
`;

export const buttonStyle = {
  borderRadius: 24,
  border: '1px solid rgb(255, 255, 255)',
  color: 'rgb(255, 255, 255)',
  background: 'transparent',
  marginRight: 24,
};

export const iconStyle = {
  color: 'rgb(255, 255, 255)',
};
