import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Form, InputNumber, Button } from 'antd';

import { DEFAULT_CHECKOUT_RADIUS } from 'constants/checkout';

import { YesNoSelection } from '../../../generalOnboarding/YesNoSelection';

import {
  nextButtonStyles,
  backButtonStyles,
  Wrapper,
  Header,
  Description,
  ButtonWrapper,
} from '../../../generalOnboarding/Onboarding.styled';

export const AutomaticCheckout = ({
  radius: currentRadius,
  setRadius,
  back,
  next,
}) => {
  const intl = useIntl();
  const [automaticCheckout, setAutomaticCheckout] = useState(false);

  const onFinish = values => {
    const { radius } = values;
    setRadius(radius);
    next();
  };

  return (
    <Wrapper>
      <Header>
        {intl.formatMessage({
          id: 'modal.createGroup.automaticCheckout.title',
        })}
      </Header>
      {!automaticCheckout ? (
        <>
          <Description>
            {intl.formatMessage({
              id: 'modal.createGroup.automaticCheckout.description',
            })}
          </Description>
          <YesNoSelection
            onYes={() => setAutomaticCheckout(true)}
            onNo={next}
            onBack={back}
          />
        </>
      ) : (
        <>
          <Description>
            {intl.formatMessage({
              id: 'modal.createGroup.automaticCheckout.radiusDescription',
            })}
          </Description>
          <Form
            onFinish={onFinish}
            initialValues={{ radius: currentRadius || DEFAULT_CHECKOUT_RADIUS }}
            style={{ marginTop: 40 }}
          >
            <Form.Item
              colon={false}
              label={intl.formatMessage({
                id: 'createGroup.radius',
              })}
              name="radius"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'error.radius',
                  }),
                },
                {
                  type: 'number',
                  min: DEFAULT_CHECKOUT_RADIUS,
                  message: intl.formatMessage({
                    id: 'settings.location.checkout.automatic.min',
                  }),
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} autoFocus />
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
        </>
      )}
    </Wrapper>
  );
};
