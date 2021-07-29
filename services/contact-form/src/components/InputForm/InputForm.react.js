import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { v4 as generateUUID } from 'uuid';
import { Checkbox, Form, Input, InputNumber, Divider } from 'antd';
import { PrimaryButton } from 'components/general';
import { useQuery } from 'react-query';

import { getAdditionalData, getDailyKey } from 'network/api';
import { PRIVACY_LINK } from 'constants/links';

// Hooks
import { useRegister } from 'components/hooks/useRegister';
import {
  useNameValidator,
  usePhoneValidator,
  useEmailValidator,
  useTableValidator,
} from 'components/hooks/useValidators';

// Components
import { FormItem } from './FormItem';
import { AddressInput } from './AddressInput';

import { ButtonWrapper, Link } from './InputForm.styled';

export const InputForm = ({
  formId,
  scanner,
  initialValues = null,
  additionalData = null,
}) => {
  const intl = useIntl();
  const [formFieldNames, setFormFieldNames] = useState({
    firstName: generateUUID(),
    lastName: generateUUID(),
    street: generateUUID(),
    number: generateUUID(),
    city: generateUUID(),
    zip: generateUUID(),
    phone: generateUUID(),
    email: generateUUID(),
    table: generateUUID(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formReference = useRef(null);

  const { firstNameValidator, lastNameValidator } = useNameValidator();
  const { phoneValidator } = usePhoneValidator();
  const { emailValidator } = useEmailValidator();
  const { tableValidator } = useTableValidator();

  const { isLoading, error, data: dailyKey } = useQuery(
    'dailyKey',
    getDailyKey,
    {
      retries: 0,
    }
  );

  const { data: checkinData } = useQuery('additionalData', () =>
    getAdditionalData(scanner.locationId).then(response => response.json())
  );

  const register = useRegister(
    formId,
    formReference,
    formFieldNames,
    () =>
      setFormFieldNames({
        firstName: generateUUID(),
        lastName: generateUUID(),
        street: generateUUID(),
        number: generateUUID(),
        city: generateUUID(),
        zip: generateUUID(),
        phone: generateUUID(),
        email: generateUUID(),
        table: generateUUID(),
      }),
    scanner,
    dailyKey
  );

  const checkIn = () => {
    setIsSubmitting(true);
    register()
      .then(() => setIsSubmitting(false))
      .catch(() => setIsSubmitting(false));
  };

  if (error || isLoading) return null;

  return (
    <>
      <Form
        onFinish={checkIn}
        ref={formReference}
        autoComplete="off"
        initialValues={initialValues}
        style={{ width: '60vw' }}
      >
        <FormItem
          generatedUUID={formFieldNames.firstName}
          validator={firstNameValidator}
          fieldName="firstName"
          isMandatory
        />
        <FormItem
          generatedUUID={formFieldNames.lastName}
          validator={lastNameValidator}
          fieldName="lastName"
          isMandatory
        />
        <AddressInput formFieldNames={formFieldNames} />
        <FormItem
          generatedUUID={formFieldNames.phone}
          validator={phoneValidator}
          fieldName="phone"
          isMandatory
        />
        <FormItem
          generatedUUID={formFieldNames.email}
          validator={emailValidator}
          fieldName="email"
        />

        {(scanner?.tableCount || checkinData?.additionalData.length !== 0) && (
          <Divider>
            {intl.formatMessage({
              id: 'contactDataForm.additionalData.divider',
            })}
          </Divider>
        )}

        {scanner?.tableCount && (
          <Form.Item name="additionalData-table" rules={tableValidator}>
            <InputNumber
              min={1}
              max={scanner.tableCount}
              autoComplete="new-password"
              placeholder={intl.formatMessage({
                id: 'contactDataForm.table',
              })}
              disabled={additionalData?.table}
            />
          </Form.Item>
        )}
        {checkinData?.additionalData &&
          checkinData.additionalData.map(entry => (
            <Form.Item key={entry.uuid} name={`additionalData-${entry.key}`}>
              <Input placeholder={entry.key} />
            </Form.Item>
          ))}
        <Form.Item
          name="acceptAGB"
          initialValue={false}
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      intl.formatMessage({ id: 'error.agreement' })
                    ),
            },
          ]}
        >
          <Checkbox data-cy="acceptAGB">
            {intl.formatMessage(
              { id: 'registration.acceptPrivacy' },
              {
                // eslint-disable-next-line react/display-name
                a: (...chunks) => (
                  <Link
                    href={PRIVACY_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chunks}
                  </Link>
                ),
              }
            )}
          </Checkbox>
        </Form.Item>
        <ButtonWrapper>
          <Form.Item
            style={{
              marginBottom: 0,
            }}
          >
            <PrimaryButton
              data-cy="contactSubmit"
              htmlType="submit"
              loading={isSubmitting}
            >
              {intl.formatMessage({
                id: 'contactDataForm.button',
              })}
            </PrimaryButton>
          </Form.Item>
        </ButtonWrapper>
      </Form>
    </>
  );
};
