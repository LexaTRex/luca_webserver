import React, { useState } from 'react';

import { useIntl } from 'react-intl';
import { Dropdown } from 'antd';

import { useQuery } from 'react-query';
import { getGroups } from 'network/api';

import { useTabletSize } from 'components/hooks/media';
import { DownOutlined } from '@ant-design/icons';
import { GroupMenu } from './GroupMenu';
import { StyledButton } from './SelectGroup.styled';
import { CreateGroup } from '../CreateGroup';

export const SelectGroup = ({ groupId }) => {
  const intl = useIntl();
  const [isDropdownOpen, setDropdownOpen] = useState();
  const isTablet = useTabletSize();

  const { isLoading, error, data: groups } = useQuery('groups', getGroups);

  if (isLoading || error || (groups.length <= 1 && !isTablet)) return null;
  if (groups.length <= 1 && isTablet) return <CreateGroup />;

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
      <StyledButton
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        data-cy="selectGroupDropdown"
      >
        {intl.formatMessage({ id: 'header.changeGroup.dropdown' })}
        <DownOutlined />
      </StyledButton>
    </Dropdown>
  );
};
