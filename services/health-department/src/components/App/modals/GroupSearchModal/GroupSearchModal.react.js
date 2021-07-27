import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Form } from 'antd';

// API
import { findGroups } from 'network/api';

// Constants
import { DEFAULT_SEARCH_LIMIT } from 'constants/search';

// Utils
import { validateZipCode } from 'utils/validators.helper';

// Components
import { DataRequestModal } from 'components/App/modals/GroupSearchModal/DataRequestModal';
import { EmptySearch } from './EmptySearch';
import {
  StyledSearchOutlined,
  DescriptionText,
  GroupSearchInput,
  ZipCodeInput,
  SubmitButton,
  InputWrapper,
  GroupSearchWrapper,
  ResultsWrapper,
  Entry,
  EntryInfo,
  EntryAdress,
  EntryName,
} from './GroupSearchModal.styled';

export const GroupSearchModal = () => {
  const intl = useIntl();
  const [searchResults, setSearchResults] = useState(null);
  const [requestData, setRequestData] = useState(null);
  const [inputValid, setInputValid] = useState({
    zipCode: true,
    groupName: false,
  });

  const back = () => {
    setRequestData(null);
  };

  const onFinish = values => {
    const { groupName, zipCode } = values;
    return findGroups({
      group: groupName,
      zipCode,
      limit: DEFAULT_SEARCH_LIMIT,
    }).then(response => {
      setSearchResults(response);
      setInputValid({ zipCode: true, groupName: true });
    });
  };

  return requestData ? (
    <DataRequestModal group={requestData} back={back} />
  ) : (
    <>
      <DescriptionText>
        {intl.formatMessage({
          id: 'groupSearch.info.search',
        })}
      </DescriptionText>
      <GroupSearchWrapper>
        <Form onFinish={onFinish}>
          <InputWrapper>
            <Form.Item
              name="groupName"
              style={{ width: '60%' }}
              rules={[
                {
                  min: 3,
                  message: intl.formatMessage({
                    id: 'groupSearch.form.error.minLength',
                  }),
                },
              ]}
            >
              <GroupSearchInput
                data-cy="groupNameInput"
                prefix={<StyledSearchOutlined />}
                placeholder={intl.formatMessage({
                  id: 'groupSearch.form.group.placeholder',
                })}
                autoFocus
                id="groupSearch"
                onChange={change => {
                  const { value } = change.target;
                  if (value && value.length >= 3)
                    return setInputValid({
                      ...inputValid,
                      groupName: true,
                    });
                  return setInputValid({ ...inputValid, groupName: false });
                }}
              />
            </Form.Item>
            <Form.Item
              name="zipCode"
              style={{ width: '30%' }}
              rules={[
                {
                  validator: (_, value) => validateZipCode(value),
                  message: intl.formatMessage({
                    id: 'groupSearch.form.error.zipCodeLength',
                  }),
                },
              ]}
            >
              <ZipCodeInput
                prefix={<StyledSearchOutlined />}
                placeholder={intl.formatMessage({
                  id: 'groupSearch.form.zipCode.placeholder',
                })}
                id="zipCode"
                onChange={change => {
                  const { value } = change.target;
                  validateZipCode(value)
                    .then(() =>
                      setInputValid({
                        ...inputValid,
                        zipCode: true,
                      })
                    )
                    .catch(() =>
                      setInputValid({ ...inputValid, zipCode: false })
                    );
                }}
              />
            </Form.Item>
          </InputWrapper>
          <Form.Item>
            <SubmitButton
              data-cy="startGroupSearch"
              htmlType="submit"
              disabled={!inputValid.zipCode || !inputValid.groupName}
            >
              {intl.formatMessage({
                id: 'groupSearch.form.button.search',
              })}
            </SubmitButton>
          </Form.Item>
        </Form>
        {!!searchResults && (
          <ResultsWrapper>
            {searchResults.length > 0 ? (
              searchResults.map(entry => (
                <Entry
                  key={entry.groupId}
                  data-cy={`group_${entry.name}`}
                  onClick={() => setRequestData(entry)}
                >
                  <EntryInfo>
                    <EntryName>{entry.name}</EntryName>
                    <EntryAdress>
                      {`${entry.baseLocation.streetName} ${entry.baseLocation.streetNr}, ${entry.baseLocation.zipCode} ${entry.baseLocation.city}`}
                    </EntryAdress>
                  </EntryInfo>
                </Entry>
              ))
            ) : (
              <EmptySearch />
            )}
          </ResultsWrapper>
        )}
      </GroupSearchWrapper>
    </>
  );
};
