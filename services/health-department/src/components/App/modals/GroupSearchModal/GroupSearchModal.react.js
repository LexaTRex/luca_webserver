import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Form } from 'antd';
import { PrimaryButton } from 'components/general';

// API
import { findGroups } from 'network/api';

// Constants
import { DEFAULT_SEARCH_LIMIT } from 'constants/search';

// Utils
import { validateZipCode } from 'utils/validatorRules.helper';

// Components
import { DataRequestModal } from 'components/App/modals/GroupSearchModal/DataRequestModal';
import { SearchResults } from './SearchResults';
import {
  StyledSearchOutlined,
  DescriptionText,
  GroupSearchInput,
  ZipCodeInput,
  InputWrapper,
  GroupSearchWrapper,
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
            <PrimaryButton
              data-cy="startGroupSearch"
              htmlType="submit"
              $floatRight
              disabled={!inputValid.zipCode || !inputValid.groupName}
            >
              {intl.formatMessage({
                id: 'groupSearch.form.button.search',
              })}
            </PrimaryButton>
          </Form.Item>
        </Form>
        <SearchResults
          setRequestData={setRequestData}
          searchResults={searchResults}
        />
      </GroupSearchWrapper>
    </>
  );
};
