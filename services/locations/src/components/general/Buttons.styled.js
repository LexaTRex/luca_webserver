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
  minWidth: '139px',
  width: 'auto',
  paddingLeft: '40px',
  paddingRight: '40px',
  boxShadow: 'none',
};

export const PrimaryButton = styled(Button)`
  ${{ ...ButtonGeneral }}
  background: ${({ $isButtonWhite }) =>
    $isButtonWhite ? '#fff' : 'rgb(195, 206, 217)'};
  border: 2px solid
    ${({ $isButtonWhite }) => ($isButtonWhite ? '#fff' : 'rgb(195, 206, 217)')};
  border-radius: 24px;
  color: rgba(0, 0, 0, 0.87);
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

export const SecondaryButton = styled(Button)`
  ${{ ...ButtonGeneral }}
  color: rgba(0, 0, 0, 0.87);
  background: transparent;
  border-radius: 24px;
  border: 2px solid rgb(80, 102, 124);
  cursor: pointer;
  transition: 0.1s ease-in-out all;

  &:hover,
  &:focus {
    color: rgba(0, 0, 0, 0.87);
    background: rgb(218, 224, 231);
    border: 2px solid rgb(80, 102, 124);
  }

  &:disabled {
    color: rgba(0, 0, 0, 0.25);
    background: #f5f5f5;
    border-color: #d9d9d9;
    text-shadow: none;
    box-shadow: none;
    cursor: no-drop;
  }
`;

export const WarningButton = styled(Button)`
  ${{ ...ButtonGeneral }}
  color: rgba(0, 0, 0, 0.87);
  background: rgb(253, 172, 114);
  border: 2px solid rgb(253, 172, 114);
  border-radius: 24px;
  cursor: pointer;
  transition: 0.1s ease-in-out all;

  &:hover,
  &:focus {
    color: rgba(0, 0, 0, 0.87) !important;
    background: rgb(253, 196, 156) !important;
    border: 2px solid rgb(253, 196, 156) !important;
  }
`;

export const DangerButton = styled(Button)`
  ${{ ...ButtonGeneral }}
  color: rgba(0, 0, 0, 0.87);
  background: transparent;
  border-radius: 24px;
  border: 2px solid rgb(253, 172, 114);
  cursor: pointer;
  transition: 0.1s ease-in-out all;

  &:hover,
  &:focus {
    color: rgba(0, 0, 0, 0.87) !important;
    background: rgb(254, 215, 187) !important;
    border: 2px solid rgb(253, 172, 114) !important;
  }
`;

export const SuccessButton = styled(Button)`
  ${{ ...ButtonGeneral }}
  color: rgba(0, 0, 0, 0.87);
  background: rgb(211, 222, 195);
  border: 2px solid rgb(211, 222, 195);
  border-radius: 24px;
  cursor: pointer;
  transition: 0.1s ease-in-out all;
  &:hover,
  &:focus {
    color: rgba(0, 0, 0, 0.87) !important;
    background: rgb(178, 197, 150) !important;
    border-color: rgb(178, 197, 150) !important;
  }
`;
