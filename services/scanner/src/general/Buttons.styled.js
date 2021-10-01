import styled from 'styled-components';
import { Button } from 'antd';

const ButtonGeneral = {
  fontFamily: 'Montserrat-Bold, sans-serif',
  fontSize: '14px',
  fontWeight: 'bold',
  letterSpacing: 0,
  lineHeight: '16px',
  textTransform: 'uppercase',
  height: '32px',
  boxShadow: 'none',
};

export const PrimaryButton = styled(Button)`
  ${{ ...ButtonGeneral }}
  min-width: 139px;
  width: auto;
  padding-left: 40px;
  padding-right: 40px;
  background: ${({ $isButtonWhite }) =>
    $isButtonWhite ? '#fff' : 'rgb(195, 206, 217)'};
  border: 2px solid
    ${({ $isButtonWhite }) => ($isButtonWhite ? '#fff' : 'rgb(195, 206, 217)')};
  border-radius: 24px;
  color: rgba(0, 0, 0, 0.87);
  align-self: flex-end;
  cursor: pointer;
  transition: 0.1s ease-in-out all;

  &:hover,
  &:focus {
    color: rgba(0, 0, 0, 0.87) !important;
    background: rgb(155, 173, 191) !important;
    border-color: rgb(155, 173, 191) !important;
  }

  &:disabled {
    background: rgb(218, 224, 231) !important;
    border-color: rgb(218, 224, 231) !important;
    color: rgb(0 0 0 / 50%) !important;
    cursor: no-drop;
  }
`;
