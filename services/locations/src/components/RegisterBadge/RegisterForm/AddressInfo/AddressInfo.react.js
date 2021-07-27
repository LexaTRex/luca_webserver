import React from 'react';
import { useIntl } from 'react-intl';
import { Input, Form, notification } from 'antd';
import { PrimaryButton, SecondaryButton } from 'components/general';

import {
  useCityValidator,
  useHouseNoValidator,
  useStreetValidator,
  useZipCodeValidator,
} from 'components/hooks/useValidators';

import {
  ContentWrapper,
  ContentTitle,
  ButtonRow,
} from '../RegisterForm.styled';

export const AddressInfo = ({ title, next, back, form, setValues }) => {
  const intl = useIntl();

  const streetValidator = useStreetValidator('streetName');
  const houseNoValidator = useHouseNoValidator('streetNr');
  const zipCodValidator = useZipCodeValidator('zipCode');
  const cityValidator = useCityValidator('city');

  const handleNext = () => {
    form.current
      .validateFields()
      .then(response => {
        setValues(response);
        next();
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage({
            id: 'error.registerBadge.invalidAddress',
          }),
        });
      });
  };

  return (
    <ContentWrapper>
      <ContentTitle>{title}</ContentTitle>
      <Form.Item
        rules={streetValidator}
        label={intl.formatMessage({
          id: 'registerBadge.street',
        })}
        name="street"
      >
        <Input />
      </Form.Item>
      <Form.Item
        rules={houseNoValidator}
        label={intl.formatMessage({
          id: 'registerBadge.streetNumber',
        })}
        name="streetNumber"
      >
        <Input />
      </Form.Item>
      <Form.Item
        rules={zipCodValidator}
        label={intl.formatMessage({
          id: 'registerBadge.zip',
        })}
        name="zip"
      >
        <Input />
      </Form.Item>
      <Form.Item
        rules={cityValidator}
        label={intl.formatMessage({
          id: 'registerBadge.city',
        })}
        name="city"
      >
        <Input />
      </Form.Item>
      <ButtonRow multipleButtons>
        <SecondaryButton onClick={back}>
          {intl.formatMessage({ id: 'registerBadge.back' })}
        </SecondaryButton>
        <PrimaryButton onClick={handleNext}>
          {intl.formatMessage({ id: 'registerBadge.next' })}
        </PrimaryButton>
      </ButtonRow>
    </ContentWrapper>
  );
};
