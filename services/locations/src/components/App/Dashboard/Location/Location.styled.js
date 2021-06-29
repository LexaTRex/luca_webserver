import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  margin: 40px;
  padding-bottom: 32px;
  flex-direction: column;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-SemiBold, sans-serif;
  font-size: 34px;
  font-weight: 600;
`;

export const NameWrapper = styled.div`
  display: flex;
`;

export const Settings = styled.div`
  margin-left: 24px;
  margin-bottom: 8px;
  cursor: pointer;
  min-width: 175px;
  align-self: flex-end;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 48px 0 0 0;
`;

export const HiddenImage = styled.img`
  display: none;
`;
