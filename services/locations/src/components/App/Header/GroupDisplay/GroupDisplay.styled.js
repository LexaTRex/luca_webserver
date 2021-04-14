import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: 1;
  display: flex;
  cursor: pointer;
  overflow: hidden;
  margin-right: 16px;
  align-items: flex-end;
`;

export const GroupName = styled.span`
  color: rgb(255, 255, 255);
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: Montserrat-SemiBold, sans-serif;
  font-size: 20px;
  font-weight: 600;
  margin-left: 77px;
  margin-bottom: -6px;
`;

export const HomeIcon = styled.img`
  margin-left: 24px;
  margin-bottom: 3px;
  width: 16px;
`;
