import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, Button } from 'antd';

import {
  nextButtonStyles,
  backButtonStyles,
  Wrapper,
  Header,
  ButtonWrapper,
} from '../../../generalOnboarding/Onboarding.styled';

export const NameInput = ({
  locationName: currentLocationName,
  setLocationName,
  locationType,
  back,
  next,
}) => {
  const intl = useIntl();

  const onFinish = values => {
    const { locationName } = values;
    setLocationName(locationName);
    next();
  };

  return (
    <Wrapper>
      <Header>
        {intl.formatMessage({
          id: `modal.createLocation.nameInput.${locationType}.title`,
        })}
      </Header>
      <Form
        onFinish={onFinish}
        initialValues={
          currentLocationName ? { locationName: currentLocationName } : {}
        }
      >
        <Form.Item
          colon={false}
          label={intl.formatMessage({
            id: `createLocation.${locationType}.locationName`,
          })}
          name="locationName"
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'error.locationName',
              }),
            },
          ]}
        >
          <Input autoFocus />
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
