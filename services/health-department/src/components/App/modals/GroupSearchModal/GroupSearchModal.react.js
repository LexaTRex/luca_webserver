import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, Form, Input } from 'antd';

// API
import { findGroups } from 'network/api';

// Constants
import { DEFAULT_SEARCH_LIMIT } from 'constants/search';

// Components
import { DataRequestModal } from 'components/App/modals/GroupSearchModal/DataRequestModal';
import { EmptySearch } from './EmptySearch';
import {
  GroupSearchWrapper,
  ResultsWrapper,
  Entry,
  EntryInfo,
  EntryAdress,
  EntryName,
} from './GroupSearchModal.styled';

export const GroupSearchModal = () => {
  const intl = useIntl();
  const [results, setResults] = useState(null);
  const [requestData, setRequestData] = useState();

  const onFinish = values =>
    findGroups({ group: values.groupName, limit: DEFAULT_SEARCH_LIMIT }).then(
      response => {
        setResults(response);
      }
    );

  return requestData ? (
    <DataRequestModal group={requestData} />
  ) : (
    <GroupSearchWrapper>
      <Form
        onFinish={onFinish}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <Form.Item
          name="groupName"
          style={{ width: '70%' }}
          rules={[
            {
              min: 3,
              message: intl.formatMessage({
                id: 'groupSearch.form.error.minLength',
              }),
            },
          ]}
        >
          <Input
            data-cy="groupNameInput"
            placeholder={intl.formatMessage({
              id: 'groupSearch.form.group.placeholder',
            })}
            autoFocus
            id="groupSearch"
            style={{
              borderLeft: 'none',
              borderRight: 'none',
              borderTop: 'none',
              color: 'white',
              borderRadius: 0,
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            data-cy="startGroupSearch"
            htmlType="submit"
            style={{
              color: '#000000',
              backgroundColor: '#ffffff',
              padding: '4px 50px',
              marginLeft: 24,
            }}
          >
            {intl.formatMessage({ id: 'groupSearch.form.button' })}
          </Button>
        </Form.Item>
      </Form>
      {!!results && (
        <ResultsWrapper>
          {results.length > 0 ? (
            results.map(entry => (
              <Entry key={entry.groupId}>
                <EntryInfo>
                  <EntryName>{entry.name}</EntryName>
                  <EntryAdress>
                    {`${entry.baseLocation.streetName} ${entry.baseLocation.streetNr}, ${entry.baseLocation.zipCode} ${entry.baseLocation.city}`}
                  </EntryAdress>
                </EntryInfo>
                <Button
                  style={{ padding: '0 40px' }}
                  data-cy={`group_${entry.name}`}
                  onClick={() => setRequestData(entry)}
                >
                  {intl.formatMessage({ id: 'groupSearch.form.request' })}
                </Button>
              </Entry>
            ))
          ) : (
            <EmptySearch />
          )}
        </ResultsWrapper>
      )}
    </GroupSearchWrapper>
  );
};
