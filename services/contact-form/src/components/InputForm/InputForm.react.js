import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { v4 as generateUUID } from 'uuid';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Grid,
  Input,
  InputNumber,
  Row,
  Divider,
} from 'antd';
import { useQuery } from 'react-query';

import { getAdditionalData, getDailyKey } from 'network/api';

// Hooks
import { useRegister } from 'components/hooks/useRegister';
import { useContactDataRules } from 'components/hooks/useContactDataRules';

// Components
import { ButtonWrapper, Link } from './InputForm.styled';

const { useBreakpoint } = Grid;
export const InputForm = ({
  scanner,
  initialValues = null,
  additionalData = null,
}) => {
  const intl = useIntl();
  const screens = useBreakpoint();
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
  const {
    firstNameValidator,
    lastNameValidator,
    streetValidator,
    houseNoValidator,
    zipCodeValidator,
    cityValidator,
    phoneValidator,
    emailValidator,
    tableValidator,
  } = useContactDataRules();

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
        <Form.Item name={formFieldNames.firstName} rules={firstNameValidator()}>
          <Input
            data-cy="firstName"
            autoComplete="new-password"
            placeholder={`* ${intl.formatMessage({
              id: 'contactDataForm.firstName',
            })}`}
          />
        </Form.Item>
        <Form.Item name={formFieldNames.lastName} rules={lastNameValidator()}>
          <Input
            data-cy="lastName"
            autoComplete="new-password"
            placeholder={`* ${intl.formatMessage({
              id: 'contactDataForm.lastName',
            })}`}
          />
        </Form.Item>
        <Row gutter={16} wrap>
          <Col span={!screens.md ? 24 : 20}>
            <Form.Item
              name={formFieldNames.street}
              rules={streetValidator()}
              width="50%"
            >
              <Input
                data-cy="street"
                autoComplete="new-password"
                placeholder={`* ${intl.formatMessage({
                  id: 'contactDataForm.street',
                })}`}
              />
            </Form.Item>
          </Col>
          <Col span={!screens.md ? 24 : 4}>
            <Form.Item name={formFieldNames.number} rules={houseNoValidator()}>
              <Input
                data-cy="number"
                autoComplete="new-password"
                placeholder={`* ${intl.formatMessage({
                  id: 'contactDataForm.number',
                })}`}
              />
            </Form.Item>
          </Col>
        </Row>
        <Input.Group
          placeholder={intl.formatMessage({
            id: 'contactDataForm.city',
          })}
        >
          <Row gutter={16}>
            <Col span={!screens.md ? 24 : 4}>
              <Form.Item name={formFieldNames.zip} rules={zipCodeValidator()}>
                <Input
                  data-cy="zip"
                  autoComplete="new-password"
                  placeholder={`* ${intl.formatMessage({
                    id: 'contactDataForm.zip',
                  })}`}
                />
              </Form.Item>
            </Col>
            <Col span={!screens.md ? 24 : 20}>
              <Form.Item name={formFieldNames.city} rules={cityValidator()}>
                <Input
                  data-cy="city"
                  autoComplete="new-password"
                  placeholder={`* ${intl.formatMessage({
                    id: 'contactDataForm.city',
                  })}`}
                />
              </Form.Item>
            </Col>
          </Row>
        </Input.Group>
        <Form.Item name={formFieldNames.phone} rules={phoneValidator()}>
          <Input
            data-cy="phone"
            autoComplete="new-password"
            placeholder={`* ${intl.formatMessage({
              id: 'contactDataForm.phone',
            })}`}
          />
        </Form.Item>
        <Form.Item name={formFieldNames.email} rules={emailValidator()}>
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
          <Form.Item name="additionalData-table" rules={tableValidator()}>
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
                    href={intl.formatMessage({
                      id: 'registration.privacyLink',
                    })}
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
            <Button
              data-cy="contactSubmit"
              type="primary"
              htmlType="submit"
              shape="round"
              loading={isSubmitting}
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
