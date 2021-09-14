import styled from 'styled-components';
import { Switch } from 'antd';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SectionTitle = styled.div`
  font-family: Montserrat-Bold, sans-serif;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

export const SwitchDescription = styled.div`
  font-family: Montserrat-Bold, sans-serif;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  padding-left: 8px;
`;

export const Section = styled.div`
  font-family: Montserrat-Medium, sans-serif;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 32px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const StyledSwitch = styled(Switch)`
  width: 40px;
`;

export const SwitchWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
