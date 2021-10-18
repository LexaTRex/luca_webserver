import styled from 'styled-components';

export const AddressWrapper = styled.div`
  margin-bottom: 40px;
`;

export const AddressHeader = styled(AddressWrapper)`
  display: flex;
  margin-bottom: 8px;
`;

export const EditAddress = styled.div`
  display: flex;
  align-items: center;
  color: rgb(80, 102, 124);
  text-decoration: underline;
  font-size: 12px;
  font-weight: bold;
  margin-left: 16px;
  cursor: pointer;
`;

export const AddressRow = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-size: 14px;
  font-weight: 500;
`;
