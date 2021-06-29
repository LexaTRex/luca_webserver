import styled from 'styled-components';

export const ProfileWrapper = styled.div`
  padding: 30px 32px 80px;
  background-color: white;
  margin: 40px;
`;

export const ProfileHeader = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-SemiBold, sans-serif;
  font-size: 34px;
  font-weight: 600;
  margin-bottom: 36px;
`;

export const StyledChildWrapper = styled.div`
  width: 50%;
  margin-bottom: 24px;
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
