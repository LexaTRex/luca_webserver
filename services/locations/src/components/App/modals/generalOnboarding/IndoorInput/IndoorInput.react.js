import React, { useRef } from 'react';
import { useIntl } from 'react-intl';
import { Form } from 'antd';
import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';

import {
  ButtonWrapper,
  Description,
  Header,
  Wrapper,
} from '../Onboarding.styled';
import { IndoorToggle } from '../../../Dashboard/IndoorToggle';

export const IndoorInput = ({
  isIndoor: currentIsIndoor,
  setIsIndoor,
  back,
  next,
}) => {
  const intl = useIntl();
  const formReference = useRef(null);

  const onFinish = values => {
    const { isIndoor } = values;
    setIsIndoor(isIndoor);
    next();
  };

  const indoorToggleHandler = value => {
    formReference.current.setFieldsValue({
      isIndoor: value,
    });
  };

  return (
    <Wrapper>
      <Header>
        {intl.formatMessage({ id: 'modal.createLocation.IndoorInput.title' })}
      </Header>
      <Description>
        {intl.formatMessage({
          id: 'modal.createLocation.IndoorInput.description',
        })}
      </Description>
      <Form
        initialValues={currentIsIndoor ? { isIndoor: currentIsIndoor } : {}}
        onFinish={onFinish}
        ref={formReference}
      >
        <Form.Item name="isIndoor">
          <IndoorToggle callback={indoorToggleHandler} />
        </Form.Item>
        <ButtonWrapper multipleButtons>
          <SecondaryButton onClick={back} data-cy="previousStep">
            {intl.formatMessage({
              id: 'authentication.form.button.back',
            })}
          </SecondaryButton>
          <PrimaryButton data-cy="nextStep" htmlType="submit">
            {intl.formatMessage({
              id: 'authentication.form.button.next',
            })}
          </PrimaryButton>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
};
