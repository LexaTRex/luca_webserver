import styled from 'styled-components';
import { Input } from 'antd';

export const ProfileWrapper = styled.div`
  padding: 30px 32px;
  background-color: white;
  margin: 40px;
`;

export const InformationWrapper = styled.div`
  padding: 30px 32px;
  background-color: white;
  margin: 0px 40px 40px 40px;
`;

export const Header = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-SemiBold, sans-serif;
  font-size: 34px;
  font-weight: 600;
  margin-bottom: 36px;
  display: flex;
`;

export const Description = styled.p`
  margin-bottom: 36px;
  display: flex;
`;

export const StyledChildWrapper = styled.div`
  margin-bottom: 64px;
`;

export const VerificationTagWrapper = styled.div`
  margin-left: 16px;
`;

export const VersionFooterWrapper = styled.div`
  text-align: right;
`;

export const StyledInput = styled(Input)`
  border: 1px solid #696969;
  background-color: transparent;
  &:hover,
  &:focus {
    border: 1px solid #696969;
  }
`;

export const StyledButtonRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
