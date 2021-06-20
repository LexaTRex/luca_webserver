import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Checkbox } from 'antd';
import { Explain, DownloadTitle, Expand } from './ConfirmPrivateKey.styled';

export const ConfirmPrivateKey = ({ setHasSavedKey, hasDownloadedKey }) => {
  const intl = useIntl();

  const handleConfirmSavedKey = event => {
    setHasSavedKey(event.target.checked);
  };

  return (
    <Expand open={hasDownloadedKey}>
      <DownloadTitle>
        {intl.formatMessage({
          id: 'modal.registerOperator.hasDownloadedKey',
        })}
      </DownloadTitle>
      <Explain style={{ marginTop: 16, color: 'red' }}>
        {intl.formatMessage({
          id: 'modal.registerOperator.explainPrivateKey',
        })}
      </Explain>
      <Form>
        <Form.Item
          name="confirmPrivateKey"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      intl.formatMessage({
                        id: 'error.confirmPrivateKey',
                      })
                    ),
            },
          ]}
        >
          <Checkbox
            onChange={handleConfirmSavedKey}
            data-cy="checkPrivateKeyIsDownloaded"
          >
            {intl.formatMessage({
              id: 'modal.registerOperator.confirmPrivateKey',
            })}
          </Checkbox>
        </Form.Item>
      </Form>
    </Expand>
  );
};
