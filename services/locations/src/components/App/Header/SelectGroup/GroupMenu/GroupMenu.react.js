import React, { useMemo } from 'react';

import { useHistory } from 'react-router-dom';
import { Menu, Select } from 'antd';
import { useIntl } from 'react-intl';
import { PlusOutlined } from '@ant-design/icons';

import { BASE_GROUP_ROUTE } from 'constants/routes';
import { useTabletSize } from 'components/hooks/media';

import { useModal } from 'components/hooks/useModal';
import { CreateGroupModal } from 'components/App/modals/CreateGroupModal';
import {
  StyledMenu,
  StyledButtonLink,
  StyledMenuItem,
  StyledSelect,
  StyledLink,
} from './GroupMenu.styled';

export const GroupMenu = ({ groups, groupId, onClose }) => {
  const intl = useIntl();
  const history = useHistory();
  const [openModal] = useModal();
  const isTablet = useTabletSize();
  const sortGroupsByName = useMemo(() => {
    return groups.sort((a, b) => a.name.localeCompare(b.name));
  }, [groups]);

  const onCreate = () => {
    onClose();
    openModal({
      content: <CreateGroupModal />,
      emphasis: 'noHeader',
    });
  };

  const handleSelectedGroupId = id => {
    onClose();
    history.push(`${BASE_GROUP_ROUTE}${id}`);
  };

  return (
    <StyledMenu>
      {isTablet && (
        <>
          <Menu.Item key="create">
            <StyledButtonLink
              type="link"
              icon={<PlusOutlined />}
              onClick={onCreate}
            >
              {intl.formatMessage({ id: 'header.createGroup' })}
            </StyledButtonLink>
          </Menu.Item>
          <Menu.Divider />
        </>
      )}
      {groups.length < 3 && !isTablet ? (
        sortGroupsByName.map(group => (
          <StyledMenuItem
            data-cy={`groupItem-${group.groupId}`}
            key={group.groupId}
            $activeGroup={group.groupId === groupId}
          >
            <StyledLink to={`${BASE_GROUP_ROUTE}${group.groupId}`}>
              {group.name}
            </StyledLink>
          </StyledMenuItem>
        ))
      ) : (
        <Menu.Item>
          <StyledSelect
            showSearch
            placeholder={intl.formatMessage({
              id: 'header.changeGroup.dropdown.searchLocation',
            })}
            defaultValue={groupId}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            data-cy="groupSelect"
            onChange={handleSelectedGroupId}
          >
            {sortGroupsByName.map(group => (
              <Select.Option
                data-cy={`groupItem-${group.groupId}`}
                key={group.groupId}
                value={group.groupId}
              >
                {group.name}
              </Select.Option>
            ))}
          </StyledSelect>
        </Menu.Item>
      )}
    </StyledMenu>
  );
};
