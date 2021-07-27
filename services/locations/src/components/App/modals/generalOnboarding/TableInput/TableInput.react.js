import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Form, InputNumber } from 'antd';

import { useTableNumberValidator } from 'components/hooks/useValidators';

import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';

import { MIN_TABLE_NUMBER, MAX_TABLE_NUMBER } from 'constants/tableNumber';
import { YesNoSelection } from '../YesNoSelection';
import { Wrapper, Header, ButtonWrapper } from '../Onboarding.styled';

export const TableInput = ({
  tableCount: currentTableCount,
  setTableCount,
  back,
  next,
}) => {
  const intl = useIntl();
  const [hasTables, setHasTables] = useState(false);
  const tableNumberValidator = useTableNumberValidator();

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
            rules={tableNumberValidator}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={MIN_TABLE_NUMBER}
              max={MAX_TABLE_NUMBER}
              autoFocus
            />
          </Form.Item>
          <ButtonWrapper multipleButtons>
            <SecondaryButton onClick={back}>
              {intl.formatMessage({
                id: 'authentication.form.button.back',
              })}
            </SecondaryButton>
            <PrimaryButton data-cy="nextStep" htmlType="submit">
              {intl.formatMessage({
                id: 'authentication.form.button.next',
              })}
            </PrimaryButton>
          </ButtonWrapper>
        </Form>
      )}
    </Wrapper>
  );
};
