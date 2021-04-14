import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  display: flex;
  align-items: flex-end;

  margin-bottom: 20px;
`;

export const SubTitle = styled.h4`
  margin: 0 0 0 12px;

  color: white;
`;

export const Logo = styled.img`
  height: 48px;
  color: black;
  @media (max-width: 768px) {
    height: 40px;
  }
`;
