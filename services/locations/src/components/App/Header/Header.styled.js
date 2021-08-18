import styled from 'styled-components';
import { Media } from 'utils/media';
import { Header } from 'antd/es/layout/layout';

export const HeaderWrapper = styled(Header)`
  background: rgb(0, 0, 0);
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  height: 80px;
  padding: 16px 40px;
`;

export const SubTitle = styled.div`
  margin-left: 16px;
  line-height: 5;
  color: rgb(255, 255, 255);
  font-size: 16px;

  ${Media.mobile`
    margin-left: 16px;
    margin-bottom: 10px;

    font-size: 10px;
  `}
`;

export const Title = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  overflow: hidden;
  height: 48px;
`;

export const Logo = styled.img`
  height: 48px;
  padding: 0;
  margin: 0;
`;

export const MenuWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  line-height: 0;
`;
