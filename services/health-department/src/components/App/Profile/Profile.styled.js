import styled from 'styled-components';

export const ProfileWrapper = styled.div`
  padding: 80px 32px;
  background-color: #bdd5dc;
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
export const buttonStyle = {
  backgroundColor: '#B8C0CA',
  color: '#000000',
  height: '48px',
  padding: '0 80px',
  marginTop: '24px',
};
