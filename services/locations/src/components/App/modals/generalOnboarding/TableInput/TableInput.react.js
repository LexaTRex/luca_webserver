import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Form, InputNumber, Button } from 'antd';

import { YesNoSelection } from '../YesNoSelection';
import {
  nextButtonStyles,
  backButtonStyles,
  Wrapper,
  Header,
  ButtonWrapper,
} from '../Onboarding.styled';

export const TableInput = ({
  tableCount: currentTableCount,
  setTableCount,
  back,
  next,
}) => {
  const intl = useIntl();
  const [hasTables, setHasTables] = useState(false);

  const onFinish = values => {
    const { tableCount } = values;
    setTableCount(tableCount);
    next();
  };

  return (
    <Wrapper>
      <Header>
        {intl.formatMessage({
          id: 'modal.createGroup.tableInput.title',
        })}
      </Header>
      {!hasTables ? (
        <YesNoSelection
          onNo={next}
          onYes={() => setHasTables(true)}
          onBack={back}
        />
      ) : (
        <Form
          onFinish={onFinish}
          initialValues={
            currentTableCount ? { tableCount: currentTableCount } : {}
          }
          style={{ marginTop: 40 }}
        >
          <Form.Item
            colon={false}
            label={intl.formatMessage({
              id: 'createGroup.tableCount',
            })}
            name="tableCount"
            rules={[
              {
                type: 'number',
                required: true,
                message: intl.formatMessage({
                  id: 'error.tableCount',
                }),
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={1} autoFocus />
          </Form.Item>
          <ButtonWrapper multipleButtons>
            <Button style={backButtonStyles} onClick={back}>
              {intl.formatMessage({
                id: 'authentication.form.button.back',
              })}
            </Button>
            <Button
              data-cy="nextStep"
              style={nextButtonStyles}
              htmlType="submit"
            >
              {intl.formatMessage({
                id: 'authentication.form.button.next',
              })}
            </Button>
          </ButtonWrapper>
        </Form>
      )}
    </Wrapper>
  );
};
