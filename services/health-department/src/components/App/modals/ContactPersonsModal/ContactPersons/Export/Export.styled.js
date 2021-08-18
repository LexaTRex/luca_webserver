import { Menu } from 'antd';
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  margin-left: auto;
`;

export const StyledLink = styled.a`
  color: rgb(80, 102, 124);
  font-family: Montserrat-Bold, sans-serif;
  font-size: 16px;
  font-weight: bold;
  height: 14px;
  text-transform: uppercase;
  text-decoration: none;
`;

export const DownloadButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  font-size: 14px;
  background: none;
  text-align: left;
  font-weight: 500;
  padding: 5px 12px;
  color: rgb(0, 0, 0);
  font-family: Montserrat-Medium, sans-serif;
`;

export const ExportButton = styled(DownloadButton)``;

export const StyledMenuItem = styled(Menu.Item)`
  padding: 0 !important;
`;
