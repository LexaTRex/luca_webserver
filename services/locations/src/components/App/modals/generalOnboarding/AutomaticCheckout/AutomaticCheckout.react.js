import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Form, InputNumber } from 'antd';

import { useCheckoutRadiusValidator } from 'components/hooks/useValidators';

import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';

import {
  DEFAULT_CHECKOUT_RADIUS,
  MAX_CHECKOUT_RADIUS,
} from 'constants/checkout';

import { YesNoSelection } from '../YesNoSelection';

import {
  Wrapper,
  Header,
  Description,
  ButtonWrapper,
} from '../Onboarding.styled';

export const AutomaticCheckout = ({
  radius: currentRadius,
  setRadius,
  back,
  next,
}) => {
  const intl = useIntl();
  const checkoutRadiusValidator = useCheckoutRadiusValidator();
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
              id: 'modal.createLocation.automaticCheckout.radiusDescription',
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
              rules={checkoutRadiusValidator}
            >
              <InputNumber
                min={DEFAULT_CHECKOUT_RADIUS}
                max={MAX_CHECKOUT_RADIUS}
                style={{ width: '100%' }}
                autoFocus
              />
            </Form.Item>
            <ButtonWrapper multipleButtons>
              <SecondaryButton onClick={back} data-cy="previousStep">
                {intl.formatMessage({
                  id: 'authentication.form.button.back',
                })}
              </SecondaryButton>
              <PrimaryButton htmlType="submit" data-cy="nextStep">
                {intl.formatMessage({
                  id: 'authentication.form.button.next',
                })}
              </PrimaryButton>
            </ButtonWrapper>
          </Form>
        </>
      )}
    </Wrapper>
  );
};
