import styled from 'styled-components';
import { Button, Layout } from 'antd';

const { Content, Sider } = Layout;

export const contentStyles = {
  backgroundColor: '#f3f5f7',
};

export const sliderStyles = {
  ...contentStyles,
  borderRight: '1px solid rgb(151, 151, 151)',
};

export const Heading = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
`;

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
