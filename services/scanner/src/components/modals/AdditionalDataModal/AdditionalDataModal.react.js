import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input, InputNumber, notification } from 'antd';
import { PrimaryButton } from 'general';

import { addCheckinData } from 'network/api';
import {
  base64ToHex,
  hexToBase64,
  bytesToHex,
  encodeUtf8,
  ENCRYPT_DLIES,
} from '@lucaapp/crypto';

import { Wrapper, ButtonRow, Info } from './AdditionalDataModal.styled';

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
          >
            <InputNumber min={1} max={scanner.tableCount} autoFocus />
          </Form.Item>
        )}
        {additionalData.map(
          (entry, index) =>
            entry.isRequired && (
              <Form.Item key={entry.uuid} name={entry.key} label={entry.key}>
                <Input autoFocus={index === 0 && !scanner.tableCount} />
              </Form.Item>
            )
        )}

        <ButtonRow>
          <Form.Item>
            <PrimaryButton htmlType="submit">
              {intl.formatMessage({ id: 'modal.additionalData.button' })}
            </PrimaryButton>
          </Form.Item>
        </ButtonRow>
      </Form>
    </Wrapper>
  );
};
