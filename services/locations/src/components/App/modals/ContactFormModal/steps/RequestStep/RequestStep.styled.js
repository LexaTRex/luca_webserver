import styled from 'styled-components';
import { Form } from 'antd';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledFormItem = styled(Form.Item)`
  width: 50%;
`;

export const Text = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Medium, sans-serif;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 24px;
`;

export const Title = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Bold, sans-serif;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 24px;
`;

export const ContactDataWrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
  justify-content: space-between;
  width: 60%;
`;

export const Name = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Medium, sans-serif;
  font-size: 16px;
  font-weight: 500;
  width: 50%;
`;

export const Value = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: Montserrat-Bold, sans-serif;
  font-size: 16px;
  font-weight: bold;
  width: 50%;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: ${({ multipleButtons }) =>
    multipleButtons ? 'space-between' : 'flex-end'};
  margin-top: 32px;
`;
