import styled from 'styled-components';

export const Content = styled.div`
  padding: 24px 32px;
  background-color: white;
  border-bottom: 1px solid rgb(151, 151, 151);
`;

export const Heading = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Medium, sans-serif;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
`;

export const Wrapper = styled.div`
  display: flex;
`;

export const Count = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Medium, sans-serif;
  font-size: 34px;
  font-weight: 500;
  padding-right: 84px;
  border-right: 1px solid rgb(151, 151, 151);
`;

export const Details = styled.div`
  flex: 1;
  margin-left: 24px;
  overflow-x: hidden;
`;

export const Detail = styled.div`
  display: flex;
`;
export const GroupName = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
`;
