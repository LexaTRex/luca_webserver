import React from 'react';
import { useIntl } from 'react-intl';
import { Button, Form, Input, InputNumber, notification, Select } from 'antd';

import { addCheckinData } from 'network/api';
import {
  base64ToHex,
  hexToBase64,
  bytesToHex,
  encodeUtf8,
  ENCRYPT_DLIES,
} from '@lucaapp/crypto';

import { Wrapper, ButtonRow, Info } from './AdditionalDataModal.styled';

const { Option } = Select;

export const AdditionalDataModal = ({
  scanner,
  traceId,
  additionalData,
  close,
}) => {
  const intl = useIntl();

  const onFinish = values => {
    const encodedData = bytesToHex(encodeUtf8(JSON.stringify(values)));

    const { publicKey, data: encryptedData, iv, mac } = ENCRYPT_DLIES(
      base64ToHex(scanner.publicKey),
      encodedData
    );

    const payload = {
      traceId,
      data: hexToBase64(encryptedData),
      publicKey: hexToBase64(publicKey),
      iv: hexToBase64(iv),
      mac: hexToBase64(mac),
    };

    addCheckinData(payload)
      .then(() => {
        notification.success({
          message: intl.formatMessage({ id: 'modal.additionalData.success' }),
        });
        close();
      })
      .catch(() => {
        notification.error({
          message: intl.formatMessage({ id: 'modal.additionalData.error' }),
        });
      });
  };

  return (
    <Wrapper>
      <Info>
        {intl.formatMessage({
          id: 'additionalData.info',
        })}
      </Info>
      <Form onFinish={onFinish} style={{ width: '100%' }}>
        {scanner.tableCount && (
          <Form.Item
            name="table"
            label={intl.formatMessage({
              id: 'modal.additionalData.table',
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'additionalData.isRequired',
                }),
              },
            ]}
          >
            <InputNumber min={1} max={scanner.tableCount} autoFocus />
          </Form.Item>
        )}
        {additionalData.map(
          (entry, index) =>
            entry.isRequired && (
              <Form.Item
                key={entry.uuid}
                name={entry.key}
                label={entry.key}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'additionalData.isRequired',
                    }),
                  },
                ]}
              >
                {entry.label ? (
                  <Select>
                    {entry.label.split(',').map(option => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                ) : (
                  <Input autoFocus={index === 0 && !scanner.tableCount} />
                )}
              </Form.Item>
            )
        )}

        <ButtonRow>
          <Form.Item>
            <Button
              htmlType="submit"
              style={{
                backgroundColor: '#4e6180',
                padding: '0 80px',
                color: 'white',
              }}
            >
              {intl.formatMessage({ id: 'modal.additionalData.button' })}
            </Button>
          </Form.Item>
        </ButtonRow>
      </Form>
    </Wrapper>
  );
};
