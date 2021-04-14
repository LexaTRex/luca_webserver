import React from 'react';
import { useIntl } from 'react-intl';
import { Descriptions } from 'antd';

// Components
import { Value } from './ProfileOverview.styled';

export const ProfileOverview = ({ me, department }) => {
  const intl = useIntl();

  return (
    <Descriptions layout="vertical" colon={false}>
      <Descriptions.Item
        style={{
          padding: '0',
        }}
        label={intl.formatMessage({
          id: 'profile.name',
        })}
        span="3"
      >
        <Value> {department.name} </Value>
      </Descriptions.Item>
      <Descriptions.Item
        style={{
          padding: '0',
        }}
        label={intl.formatMessage({
          id: 'profile.firstname',
        })}
        span="3"
      >
        <Value> {me.firstName} </Value>
      </Descriptions.Item>
      <Descriptions.Item
        style={{
          padding: '0',
        }}
        label={intl.formatMessage({
          id: 'profile.lastname',
        })}
        span="3"
      >
        <Value> {me.lastName} </Value>
      </Descriptions.Item>
      <Descriptions.Item
        style={{
          padding: '0',
        }}
        label={intl.formatMessage({
          id: 'profile.email',
        })}
        span="3"
      >
        <Value> {me.email} </Value>
      </Descriptions.Item>
    </Descriptions>
  );
};
