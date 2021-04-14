import styled from 'styled-components';

export const RegistrationWrapper = styled.div`
  display: flex;
  max-width: 100vw;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 40px 40px;
  word-break: break-all;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  flex-basis: 80%;
`;

export const RegistrationCard = styled.div`
  max-width: 100%;
  overflow-x: hidden;
  border-radius: 20px;
  padding: 40px 80px;
  background-color: #e8e7e5;
  @media (max-width: 767px) {
    padding: 16px 32px;
  }
`;

export const Headline = styled.h1`
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-bottom: 40px;
  border-bottom: 1px solid black;
`;

export const SwitchHeadline = styled.h3`
  text-align: center;
  margin-bottom: 15px;
`;

export const StoreWrapper = styled.div`
  display: flex;
  margin-bottom: 15px;
`;
export const StoreLogo = styled.img`
  height: 10vw;
`;
export const StoreLogoWrapper = styled.a`
  flex: 1;
  display: flex;
  align-content: center;
  justify-content: center;
`;
