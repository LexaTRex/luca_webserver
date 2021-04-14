import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { Form, InputNumber } from 'antd';
import React, { useCallback, useState } from 'react';

import { DEFAULT_CHECKOUT_RADIUS } from 'constants/checkout';

import { updateLocation } from 'network/api';
import {
  CardSection,
  LocationCard,
  CardSectionDescription,
  CardSectionTitle,
} from '../LocationCard';
import { Switch } from '../../Switch';
import { StyledSwitchContainer } from '../GenerateQRCodes/GenerateQRCodes.styled';

export const Checkout = ({ location }) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [isAutoCheckoutActive, setIsAutoCheckoutActive] = useState(
    !!location.radius
  );

  const refetch = useCallback(() => {
    queryClient.invalidateQueries(`location/${location.uuid}`);
  }, [location, queryClient]);

  const onIsAutoCheckoutChanged = useCallback(() => {
    setIsAutoCheckoutActive(!isAutoCheckoutActive);
    if (isAutoCheckoutActive) {
      updateLocation({ locationId: location.uuid, data: { radius: 0 } })
        .then(refetch)
        .catch(refetch);
    } else {
      updateLocation({
        locationId: location.uuid,
        data: { radius: DEFAULT_CHECKOUT_RADIUS },
      })
        .then(refetch)
        .catch(refetch);
    }
  }, [isAutoCheckoutActive, location.uuid, refetch]);

  return (
    <LocationCard
      isCollapse
      title={intl.formatMessage({ id: 'settings.location.checkout.headline' })}
      testId="checkoutRadius"
    >
      <CardSection isLast>
        <CardSectionTitle>
          {intl.formatMessage({ id: 'settings.location.checkout.title' })}
          <StyledSwitchContainer>
            <Switch
              data-cy="activateCheckoutRadius"
              checked={isAutoCheckoutActive}
              onChange={onIsAutoCheckoutChanged}
            />
          </StyledSwitchContainer>
        </CardSectionTitle>
        <CardSectionDescription>
          {intl.formatMessage({
            id: 'settings.location.checkout.automatic.description',
          })}
        </CardSectionDescription>
        {isAutoCheckoutActive && location.radius > 0 && (
          <Form
            step={1}
            style={{ width: '100%' }}
            initialValues={location}
            onValuesChange={({ radius }) =>
              updateLocation({
                locationId: location.uuid,
                data: { radius },
              })
            }
          >
            <Form.Item
              name="radius"
              label={intl.formatMessage({
                id: 'settings.location.checkout.automatic.radius',
              })}
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
              <InputNumber min={DEFAULT_CHECKOUT_RADIUS} />
            </Form.Item>
          </Form>
        )}
      </CardSection>
    </LocationCard>
  );
};
