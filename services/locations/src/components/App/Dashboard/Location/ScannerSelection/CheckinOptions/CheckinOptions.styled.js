import styled from 'styled-components';

export const ServiceArea = styled.div`
  display: flex;
`;

export const ServiceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 48px;
`;

export const Service = styled.div`
  display: flex;
  flex-direction: column;
  background: rgb(195, 206, 217);
  border-radius: 4px;
  box-shadow: 0px 2px 4px 0px rgba(143, 143, 143, 0.5);
  height: 168px;
  width: 180px;
  cursor: pointer;
`;

export const ServiceName = styled.div`
  margin: 0 auto;
  text-align: center;
  width: 85%;
  color: rgba(0, 0, 0, 0.87);
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
`;

export const ServiceLink = styled.div`
  margin-top: 16px;
`;

export const LinkContent = styled.div`
  cursor: pointer;
  color: rgb(80, 102, 124);
  font-family: Montserrat-Bold, sans-serif;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
`;

export const iconStyles = { margin: '32px 0 16px 0', fontSize: 40 };
