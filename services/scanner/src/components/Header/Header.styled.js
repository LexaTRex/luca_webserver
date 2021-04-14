import styled from 'styled-components';

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const SubTitle = styled.div`
  color: white;
  display: flex;
  align-items: flex-end;
  margin-left: 24px;
  margin-bottom: -4px;
`;

export const Title = styled.div`
  display: flex;
`;

export const Logo = styled.img`
  height: 48px;
  color: black;
  padding-left: 48px;
  @media (max-width: 768px) {
    height: 30px;
  }
`;
