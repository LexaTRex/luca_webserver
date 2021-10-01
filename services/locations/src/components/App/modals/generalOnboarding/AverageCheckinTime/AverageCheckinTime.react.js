import React from 'react';
import { useIntl } from 'react-intl';
import { Form, TimePicker } from 'antd';

import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';

import {
  Wrapper,
  Header,
  ButtonWrapper,
  Description,
} from '../Onboarding.styled';

export const AverageCheckinTime = ({
  averageCheckinTime: currentAverageCheckinTime,
  setAverageCheckinTime,
  back,
  next,
}) => {
  const intl = useIntl();

  const onFinish = ({ averageCheckinTime }) => {
    setAverageCheckinTime(averageCheckinTime);
    next();
  };

  return (
    <Wrapper>
      <Header>
        {intl.formatMessage({
          id: 'modal.createGroup.averageCheckinTime.title',
        })}
      </Header>
      <Description>
        {intl.formatMessage(
          {
            id: 'modal.createGroup.averageCheckinTime.description',
          },
          { br: <br /> }
        )}
      </Description>

      <Form
        onFinish={onFinish}
        initialValues={{
          averageCheckinTime: currentAverageCheckinTime || null,
        }}
        style={{ marginTop: 40 }}
      >
        <Form.Item
          colon={false}
          label={intl.formatMessage({
            id: 'createGroup.averageCheckinTime',
          })}
          name="averageCheckinTime"
        >
          <TimePicker
            style={{ width: 200 }}
            showNow={false}
            format="HH:mm"
            minuteStep={15}
            placeholder={intl.formatMessage({
              id: 'settings.location.checkout.average.placeholder',
            })}
          />
        </Form.Item>
        <ButtonWrapper multipleButtons>
          <SecondaryButton onClick={back}>
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
