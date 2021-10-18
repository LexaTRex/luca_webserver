import styled from 'styled-components';

export const QrPrintWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  width: 100%;
  border-top: 1px solid rgb(151, 151, 151);
  background-color: rgba(248, 249, 250);
  margin-bottom: -32px;
`;

export const QrPrintLogo = styled.img`
  height: 16px;
  width: 110px;
  margin-left: 32px;
`;

export const LinkWrapper = styled.a`
  display: flex;
  justify-content: flex-end;
  margin-right: 32px;
  width: auto;
  cursor: pointer;
  text-decoration: none;
`;

export const QrPrintText = styled.div`
  margin: 16px 0 24px 32px;
  font-size: 14px;
  font-weight: 500;
`;

export const QrPrintStep = styled(QrPrintText)`
  margin: 8px 0 8px 32px;
  display: flex;
`;

export const PrintLink = styled.div`
  font-family: Montserrat-Bold, sans-serif;
  font-size: 14px;
  font-weight: bold;
  margin-left: 4px;
  white-space: nowrap;
`;
