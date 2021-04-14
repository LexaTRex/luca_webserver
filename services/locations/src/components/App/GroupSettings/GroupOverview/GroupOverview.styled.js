import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: rgb(255, 255, 255);
  border-radius: 4px;
  padding: 24px 0 32px 0;
  margin: 32px 0;
`;

export const Title = styled.div`
  color: rgb(0, 0, 0);
  font-family: Montserrat-SemiBold, sans-serif;
  font-size: 16px;
  font-weight: 600;
  padding: 0 32px 32px;
  border-bottom: 1px solid rgb(151, 151, 151);
`;

export const GuestWrapper = styled.div`
  margin-top: 24px;
  padding: 0 32px 0;
`;

export const GuestHeader = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Medium, sans-serif;
  font-size: 16px;
  font-weight: 500;
`;
export const Info = styled.div`
  display: flex;
`;

export const InfoWrapper = styled.div`
  display: flex;
  padding-top: 10px;
  justify-content: space-between;
`;

export const buttonStyles = {
  backgroundColor: 'rgb(195, 206, 217)',
  color: 'rgba(0, 0, 0, 0.87)',
  fontFamily: 'Montserrat-Bold, sans-serif',
  fontSize: 14,
  fontWeight: 'bold',
};
