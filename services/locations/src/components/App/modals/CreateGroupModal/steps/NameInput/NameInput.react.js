import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, Button } from 'antd';

import { getRequiredRule } from 'utils/validatorRules';
import { requiresGroupName } from 'constants/errorMessages';

import {
  nextButtonStyles,
  backButtonStyles,
  Wrapper,
  Header,
  ButtonWrapper,
} from '../../../generalOnboarding/Onboarding.styled';

export const NameInput = ({
  groupName: currentGroupName,
  setGroupName,
  groupType,
  back,
  next,
}) => {
  const intl = useIntl();

  const onFinish = values => {
    const { groupName } = values;
    setGroupName(groupName);
    next();
  };

  return (
    <Wrapper>
      <Header>
        {intl.formatMessage({
          id: `modal.createGroup.nameInput.${groupType}.title`,
        })}
      </Header>
      <Form
        onFinish={onFinish}
        initialValues={currentGroupName ? { groupName: currentGroupName } : {}}
      >
        <Form.Item
          colon={false}
          label={intl.formatMessage({
            id: `createGroup.${groupType}.groupName`,
          })}
          name="groupName"
          rules={[getRequiredRule(intl, requiresGroupName)]}
        >
          <Input autoFocus />
        </Form.Item>
        <ButtonWrapper multipleButtons>
          <Button style={backButtonStyles} onClick={back}>
            {intl.formatMessage({
              id: 'authentication.form.button.back',
            })}
          </Button>
          <Button style={nextButtonStyles} htmlType="submit">
            {intl.formatMessage({
              id: 'authentication.form.button.next',
            })}
          </Button>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
};
