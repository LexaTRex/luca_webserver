import styled from 'styled-components';
import { Select, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';

export const StyledMenu = styled(Menu)`
  box-sizing: border-box;
  padding: 0 4px;
  border-radius: 4px;

  &.ant-menu-vertical {
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
      0 9px 28px 8px rgb(0 0 0 / 5%);
  }

  &.ant-menu .ant-menu-item-selected {
    background-color: #fff;
  }
`;

export const StyledMenuItem = styled(Menu.Item)`
  color: #000;
  background-color: ${properties =>
    properties.$activeGroup ? 'rgb(195, 206, 217)' : '#fff'};

  &:active,
  &:focus,
  &:hover {
    background-color: #f5f5f5;

    a {
      color: #000;
    }
  }
`;

export const StyledSelect = styled(Select)`
  width: 200px;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  padding: 8px;
  color: #000;

  &:active,
  &:focus,
  &:hover {
    color: #000;
  }
`;

export const StyledButtonLink = styled(Button)`
  color: rgba(0, 0, 0, 0.87);

  &:active,
  &:focus,
  &:hover {
    color: rgba(0, 0, 0, 0.87);
    background-color: #f5f5f5;
  }
`;
