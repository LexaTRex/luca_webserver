import styled from 'styled-components';

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

export const SubTitle = styled.div`
  color: black;
  display: flex;
  align-items: flex-end;
  margin-left: 24px;
  margin-bottom: -4px;
`;

export const Title = styled.div`
  display: flex;
`;

export const Logo = styled.img`
  height: 60px;
  color: black;
  @media (max-width: 768px) {
    height: 40px;
  }
`;

export const RegistratorTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  width: 100%;
  margin: 24px 0;
  text-align: center;
`;
