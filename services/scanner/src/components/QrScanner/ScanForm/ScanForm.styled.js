import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const FormWrapper = styled.div`
  background: rgb(255, 255, 255);
  position: relative;
  border-radius: 2px;
  height: 496px;
  width: 624px;
  padding: 56px 48px;
  @media (max-width: 768px) {
    padding: 16px 24px;
  }
`;

export const Content = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: black;
`;

export const Count = styled.div`
  font-size: 68px;
  display: flex;
`;

export const HiddenInput = styled.input`
  width: 1px;
  opacity: 0;

  padding: 0;
  border: none;

  overflow: hidden;
`;

export const SuccessOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: grey;
  opacity: 0.7;
`;
