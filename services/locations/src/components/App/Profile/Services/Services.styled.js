import styled from 'styled-components';

export const Content = styled.div`
  padding: 24px 32px;
  background-color: white;
`;

export const Heading = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Link = styled.a`
  color: rgb(80, 102, 124);
  font-family: Montserrat-Bold, sans-serif;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 24px;
  text-decoration: none;
  :hover {
    color: rgb(80, 102, 124);
  }
`;
