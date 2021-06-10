import { Form } from 'antd';
import styled from 'styled-components';

export const StyledContainer = styled.div`
  width: 100%;
  height: 54px;
  .form-control {
    color: #fff;
    width: 100% !important;
    height: 54px !important;
    border-width: 0 !important;
    background-color: #000 !important;
  }
  .react-tel-input {
    margin-top: 12px !important;
    border-radius: 3.5px !important;
    border: 1px solid #b8c0ca !important;
  }

  .form-control:focus {
    border-width: 0 !important;
    box-shadow: none !important;
  }

  .special-label {
    background-color: #000 !important;
    color: white !important;
  }

  .flag-dropdown {
    background-color: #000 !important;
  }

  .country-name {
    color: #000;
  }
`;
export const FormItem = styled(Form.Item)`
  width: 100% !important;

  .ant-form-item-explain {
    color: #fff !important;
  }
`;
export const StyledLabel = styled.label`
  top: -10px;
  left: 15px;
  z-index: 0;
  height: 20px;
  display: block;
  font-size: 12px;
  transition: 0.2s;
  font-weight: 500;
  line-height: 20px;
  position: absolute;
  letter-spacing: 0.4px;
  color: white;
  font-family: Montserrat-Medium, sans-serif;
  background-color: ${({ bgColor }) => bgColor};
`;
export const StyledInput = styled.input`
  outline: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  padding: 15px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  border-radius: 3.5px;
  letter-spacing: 0.15px;
  background: transparent;
  border: 1px solid #b8c0ca;
  transition: border-color 0.2s;
  color: rgba(255, 255, 255, 0.87);
  font-family: Montserrat-Medium, sans-serif;

  &::placeholder {
    color: transparent;
  }

  &:placeholder-shown ~ ${StyledLabel} {
    top: 18px;
    left: 15px;
    cursor: text;
    font-size: 1.3rem;
  }

  &:focus ~ ${StyledLabel} {
    top: -10px;
    display: block;
    font-size: 1rem;
    transition: 0.2s;
    position: absolute;
  }

  &:focus {
    font-weight: 700;
  }
  /* reset input */
  &:required,
  &:invalid {
    box-shadow: none;
  }
`;
