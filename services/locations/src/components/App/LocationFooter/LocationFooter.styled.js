import styled from 'styled-components';

export const Wrapper = styled.footer`
  display: flex;
  padding: 32px 0 0;
  flex-direction: row;
  justify-content: flex-end;
`;
export const Link = styled.a`
  border: none;
  padding-left: 16px;
  background: transparent;
  color: ${({ color }) => color};
`;
export const Version = styled.span`
  color: ${({ color }) => color};
`;
