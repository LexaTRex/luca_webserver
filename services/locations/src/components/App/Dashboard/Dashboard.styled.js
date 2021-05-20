import { Button, Layout } from 'antd';
import styled from 'styled-components';

const { Content, Sider } = Layout;

export const MainContent = styled(Content)`
  background-color: #f3f5f7;
`;
export const LocationSider = styled(Sider)`
  background-color: #f3f5f7;
  border-right: 1px solid rgb(151, 151, 151);
`;
export const LinkButton = styled(Button)`
  color: rgb(195, 206, 217);
`;
