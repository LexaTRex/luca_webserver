import styled from 'styled-components';

export const ProfileWrapper = styled.div`
  padding: 30px 32px;
  background-color: white;
  margin: 40px;
`;

export const ProfileHeader = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-SemiBold, sans-serif;
  font-size: 34px;
  font-weight: 600;
  margin-bottom: 36px;
  display: flex;
`;

export const StyledChildWrapper = styled.div`
  margin-bottom: 24px;
`;

export const VerificationTagWrapper = styled.div`
  margin-left: 16px;
`;

export const VersionFooterWrapper = styled.div`
  padding-top: 42px;
  text-align: right;
`;

export const inputStyle = {
  border: '1px solid #696969',
  backgroundColor: 'transparent',
};

export const disabledInputStyle = {
  ...inputStyle,
  backgroundColor: 'rgba(0,0,0,0.1) !important',
};

export const StyledButtonRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
