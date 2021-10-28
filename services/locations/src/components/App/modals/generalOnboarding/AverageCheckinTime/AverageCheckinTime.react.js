import React from 'react';
import { useIntl } from 'react-intl';
import { Form } from 'antd';

import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';

import { setAverageCheckoutTime } from 'utils/time';

import {
  Wrapper,
  Header,
  ButtonWrapper,
  Description,
  StyledTimePicker,
} from '../Onboarding.styled';
import { timeDiffValidator } from './AverageCheckinTime.helper';

export const AverageCheckinTime = ({
  averageCheckinTime: currentAverageCheckinTime,
  setAverageCheckinTime,
  back,
  next,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  const onFinish = ({ averageCheckinTime }) => {
    setAverageCheckinTime(averageCheckinTime);
    timeDiffValidator(averageCheckinTime, next, intl);
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
        form={form}
        style={{ marginTop: 40 }}
      >
        <Form.Item
          colon={false}
          label={intl.formatMessage({
            id: 'createGroup.averageCheckinTime',
          })}
          name="averageCheckinTime"
        >
          <StyledTimePicker
            showNow={false}
            format="HH:mm"
            minuteStep={15}
            onSelect={time => {
              setAverageCheckoutTime(time, form);
            }}
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
