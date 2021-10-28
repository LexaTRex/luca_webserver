import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input } from 'antd';

import { useLocationNameValidator } from 'components/hooks/useValidators';

import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';

import {
  Wrapper,
  Header,
  ButtonWrapper,
} from 'components/App/modals/generalOnboarding/Onboarding.styled';

export const NameInput = ({
  groupName: currentGroupName,
  setGroupName,
  groupType,
  back,
  next,
}) => {
  const intl = useIntl();
  const groupNameValidator = useLocationNameValidator('groupName');

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
          rules={groupNameValidator}
        >
          <Input autoFocus />
        </Form.Item>
        <ButtonWrapper multipleButtons>
          <SecondaryButton onClick={back}>
            {intl.formatMessage({
              id: 'authentication.form.button.back',
            })}
          </SecondaryButton>
          <PrimaryButton htmlType="submit">
            {intl.formatMessage({
              id: 'authentication.form.button.next',
            })}
          </PrimaryButton>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
};
