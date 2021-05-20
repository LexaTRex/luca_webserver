import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  width: 700px;
  flex-direction: column;
`;

export const Loading = styled.div`
  font-size: 24px;
  text-align: center;
  margin-top: 24px;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 16px;

  border-bottom: 1px solid rgb(151, 151, 151);
`;

export const TableContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ContentValues = styled.div`
  display: flex;
  margin-bottom: 8px;
  justify-content: space-between;
  width: 50%;
`;

export const HeaderValues = styled.div`
  display: flex;
  font-family: Montserrat-SemiBold, sans-serif;
  font-size: 14px;
  font-weight: 600;
  justify-content: space-between;
  width: 50%;
`;

export const Entry = styled.div`
  width: 50%;
`;

export const ActiveTableCount = styled.div`
  font-family: Montserrat-Medium, sans-serif;
  font-size: 16px;
  font-weight: 500;
`;

export const RefreshTime = styled.div`
  font-family: Montserrat-Medium, sans-serif;
  font-size: 14px;
  font-weight: 500;
`;

export const buttonStyles = {
  border: '2px solid rgb(80, 102, 124)',
  fontFamily: 'Montserrat-Bold. sans-serif',
  fontSize: 14,
  fontWeight: 'bold',
  padding: '0 40px',
  color: 'black',
};
