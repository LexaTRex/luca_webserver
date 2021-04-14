import React from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { Table } from 'antd';
import { getLicenses } from 'network/static';
import { TableStyle, StyledLicenseLink } from './Licenses.styled';

const PUBLIC_URL_PATH = process.env.PUBLIC_URL;

export const Licenses = () => {
  const intl = useIntl();

  const columns = [
    {
      title: intl.formatMessage({ id: 'license.name' }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'license.version' }),
      dataIndex: 'version',
    },
    {
      title: intl.formatMessage({ id: 'license.license' }),
      dataIndex: 'license',
    },
  ];

  const { isLoading, error, data } = useQuery('licenses', () => getLicenses());

  if (isLoading || error) return null;

  return (
    <>
      <StyledLicenseLink href={`${PUBLIC_URL_PATH}/licenses-full.txt`}>
        {intl.formatMessage({ id: 'license.license.full' })}
      </StyledLicenseLink>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        style={TableStyle}
        rowKey="name"
      />
    </>
  );
};
