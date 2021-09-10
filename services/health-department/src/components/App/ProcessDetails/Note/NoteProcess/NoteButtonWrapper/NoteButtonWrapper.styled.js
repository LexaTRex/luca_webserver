import styled from 'styled-components';

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-left: 32px;
`;

export const LinkButton = styled.a`
  color: rgb(80, 102, 124);
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
  ${({ hasMarginRight }) => (hasMarginRight ? 'margin-right: 24px;' : '')};
`;
