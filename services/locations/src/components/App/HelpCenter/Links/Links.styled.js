import styled from 'styled-components';
import Icon from '@ant-design/icons';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid rgb(151, 151, 151);
  margin: 0 -32px;
`;

export const LinkWrapper = styled.div`
  display: flex;
  margin-bottom: 24px;
  padding: 0 32px;
`;

export const LinkText = styled.div`
  color: rgb(80, 102, 124);
  font-family: Montserrat-Bold, sans-serif;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
`;

export const StyledIcon = styled(Icon)`
  margin-left: 8px;
`;
