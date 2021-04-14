import React from 'react';
import { useIntl } from 'react-intl';
import { Form, Input } from 'antd';

import bin from 'assets/bin.svg';

import {
  StyledButton,
  StyledTrashIcon,
  StyledInputContainer,
} from './AdditionalData.styled';

export const AdditionalData = ({
  additionalData,
  onChangeData,
  removeAdditionalData,
  onBlur,
}) => {
  const intl = useIntl();

  return (
    <Form
      style={{ width: '100%' }}
      onValuesChange={({ key }) => {
        if (key.startsWith('_')) {
          return;
        }
        onChangeData(additionalData.uuid, 'key', key);
      }}
    >
      <Form.Item
        name="key"
        colon={false}
        label={intl.formatMessage({
          id: 'settings.location.checkin.additionalData.input',
        })}
        onBlur={event => onBlur(event, additionalData.uuid)}
        rules={[
          ({ getFieldValue }) => ({
            validator() {
              if (getFieldValue('key').startsWith('_')) {
                return Promise.reject(
                  new Error(
                    intl.formatMessage({
                      id:
                        'settings.location.checkin.additionalData.input.error',
                    })
                  )
                );
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <StyledInputContainer>
          <Input defaultValue={additionalData.key} />
          <StyledButton
            data-cy="removeAdditionalData"
            onClick={() => removeAdditionalData(additionalData.uuid)}
          >
            <StyledTrashIcon src={bin} />
          </StyledButton>
        </StyledInputContainer>
      </Form.Item>
    </Form>
  );
};
