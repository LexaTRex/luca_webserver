import styled from 'styled-components';
import { Media } from 'utils/media';

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 16px 40px;
  background: rgb(0, 0, 0);
`;

export const SubTitle = styled.div`
  display: flex;
  align-items: flex-end;
  margin-left: 16px;
  margin-bottom: -6px;
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
  overflow: hidden;
`;

export const Logo = styled.img`
  height: 48px;
`;

export const MenuWrapper = styled.div`
  margin-top: 10px;
  display: flex;
`;
