import React, { useState } from 'react';
import { Select, Button } from 'antd';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';

import {
  Headline,
  ButtonWrapper,
  ResultWrapper,
} from './SelectCaseStep.styled';

const { Option } = Select;

export function SelectCaseStep({ client, onSelectCase }) {
  const intl = useIntl();
  const [selectedCase, setSelectedCase] = useState();
  const { error, isLoading, data: cases } = useQuery('sormas-get-cases', () =>
    client.getActiveUUIDs()
  );
  const { data: activeCase } = useQuery(`${selectedCase}`, () =>
    client.getCaseByUUID(selectedCase)
  );
  if (error || isLoading) {
    return null;
  }

  return (
    <>
      <Headline>
        {intl.formatMessage({
          id: 'modal.sormas.selectstep.selectCase',
        })}
        :
      </Headline>
      <Select
        showSearch
        style={{ width: '100%' }}
        onSelect={setSelectedCase}
        placeholder={intl.formatMessage({
          id: 'modal.sormas.selectstep.selectCase',
        })}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {cases.map(sormasCase => (
          <Option key={sormasCase} value={sormasCase}>
            {sormasCase}
          </Option>
        ))}
      </Select>
      {activeCase && (
        <ResultWrapper>
          {intl.formatMessage({
            id: 'modal.sormas.selectstep.selectCase.person',
          })}
          {activeCase.person.firstName} {activeCase.person.lastName}
        </ResultWrapper>
      )}
      <ButtonWrapper>
        <Button
          style={{ marginTop: '12px', alignSelf: 'flex-end' }}
          disabled={!selectedCase}
          onClick={() => {
            onSelectCase(selectedCase);
          }}
        >
          {intl.formatMessage({
            id: 'modal.sormas.selectstep.export',
          })}
        </Button>
      </ButtonWrapper>
    </>
  );
}
