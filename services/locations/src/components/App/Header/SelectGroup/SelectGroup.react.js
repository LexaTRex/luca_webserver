import React, { useState } from 'react';

import { useIntl } from 'react-intl';
import { Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { useQuery } from 'react-query';

import { getGroups } from 'network/api';
import { useTabletSize } from 'components/hooks/media';

import { GroupMenu } from './GroupMenu';
import { buttonStyle, iconStyle } from './SelectGroup.styled';

export const SelectGroup = ({ groupId }) => {
  const intl = useIntl();
  const [isDropdownOpen, setDropdownOpen] = useState();
  const isTablet = useTabletSize();

  const { isLoading, error, data: groups } = useQuery('groups', () =>
    getGroups()
  );

  if (isLoading || error || (groups.length <= 1 && !isTablet)) return null;

  return (
    <Dropdown
      visible={isDropdownOpen}
      onVisibleChange={setDropdownOpen}
      overlay={
        <GroupMenu
          groups={groups}
          groupId={groupId}
          onClose={() => setDropdownOpen(false)}
        />
      }
    >
      <Button
        style={buttonStyle}
        onClick={() => setDropdownOpen(!isDropdownOpen)}
      >
        {intl.formatMessage({ id: 'header.changeGroup.dropdown' })}
        <DownOutlined style={iconStyle} data-cy="selectGroupDropdown" />
      </Button>
    </Dropdown>
  );
};
