import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { v4 as generateUUID } from 'uuid';
import {
  Form,
  Col,
  Row,
  Input,
  Button,
  Checkbox,
  InputNumber,
  Divider,
} from 'antd';
import { useQuery } from 'react-query';

import { getDailyKey, getAdditionalData } from 'network/api';

// Hooks
import { useRegister } from 'components/hooks/useRegister';
import { useContactDataRules } from 'components/hooks/useContactDataRules';

// Components
import { ButtonWrapper } from './InputForm.styled';

export const InputForm = ({
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
  const getRules = useContactDataRules();

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
        <Form.Item
          name={formFieldNames.firstName}
          rules={getRules('firstName')}
        >
          <Input
            data-cy="firstName"
            autoComplete="new-password"
            placeholder={intl.formatMessage({
              id: 'contactDataForm.firstName',
            })}
          />
        </Form.Item>
        <Form.Item name={formFieldNames.lastName} rules={getRules('lastName')}>
          <Input
            data-cy="lastName"
            autoComplete="new-password"
            placeholder={intl.formatMessage({
              id: 'contactDataForm.lastName',
            })}
          />
        </Form.Item>
        <Input.Group>
          <Row gutter={16}>
            <Col span={20}>
              <Form.Item
                name={formFieldNames.street}
                rules={getRules('street')}
              >
                <Input
                  data-cy="street"
                  autoComplete="new-password"
                  placeholder={intl.formatMessage({
                    id: 'contactDataForm.street',
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name={formFieldNames.number}
                rules={getRules('number')}
              >
                <Input
                  data-cy="number"
                  autoComplete="new-password"
                  placeholder={intl.formatMessage({
                    id: 'contactDataForm.number',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
        </Input.Group>
        <Input.Group
          placeholder={intl.formatMessage({
            id: 'contactDataForm.city',
          })}
        >
          <Row gutter={16}>
            <Col span={4}>
              <Form.Item name={formFieldNames.zip} rules={getRules('zip')}>
                <Input
                  data-cy="zip"
                  autoComplete="new-password"
                  placeholder={intl.formatMessage({
                    id: 'contactDataForm.zip',
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={20}>
              <Form.Item name={formFieldNames.city} rules={getRules('city')}>
                <Input
                  data-cy="city"
                  autoComplete="new-password"
                  placeholder={intl.formatMessage({
                    id: 'contactDataForm.city',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
        </Input.Group>
        <Form.Item name={formFieldNames.phone} rules={getRules('phone')}>
          <Input
            data-cy="phone"
            autoComplete="new-password"
            placeholder={intl.formatMessage({
              id: 'contactDataForm.phone',
            })}
          />
        </Form.Item>
        <Form.Item name={formFieldNames.email}>
          <Input
            data-cy="email"
            autoComplete="new-password"
            placeholder={intl.formatMessage({
              id: 'contactDataForm.email',
            })}
          />
        </Form.Item>
        {(scanner?.tableCount || checkinData?.additionalData.length !== 0) && (
          <Divider>
            {intl.formatMessage({
              id: 'contactDataForm.additionalData.divider',
            })}
          </Divider>
        )}
        {scanner?.tableCount && (
          <Form.Item name="additionalData-table">
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
                  <a
                    href={intl.formatMessage({
                      id: 'registration.privacyLink',
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chunks}
                  </a>
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
            <Button
              data-cy="contactSubmit"
              type="primary"
              htmlType="submit"
              shape="round"
              loading={isSubmitting}
              style={{
                backgroundColor: '#4e6180',
                padding: '0 40px',
                border: 'none',
              }}
            >
              {intl.formatMessage({
                id: 'contactDataForm.button',
              })}
            </Button>
          </Form.Item>
        </ButtonWrapper>
      </Form>
    </>
  );
};
