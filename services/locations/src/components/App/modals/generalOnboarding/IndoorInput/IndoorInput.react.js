import React, { useRef } from 'react';
import { useIntl } from 'react-intl';
import { Button, Form } from 'antd';

import {
  backButtonStyles,
  ButtonWrapper,
  Description,
  Header,
  nextButtonStyles,
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
          <Button
            onClick={back}
            data-cy="previousStep"
            style={backButtonStyles}
          >
            {intl.formatMessage({
              id: 'authentication.form.button.back',
            })}
          </Button>
          <Button data-cy="nextStep" style={nextButtonStyles} htmlType="submit">
            {intl.formatMessage({
              id: 'authentication.form.button.next',
            })}
          </Button>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
};
