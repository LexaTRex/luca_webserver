import React, { useMemo } from 'react';

import { Menu } from 'antd';
import { useIntl } from 'react-intl';
import { PlusOutlined } from '@ant-design/icons';

import { BASE_GROUP_ROUTE } from 'constants/routes';
import { useTabletSize } from 'components/hooks/media';

import { useModal } from 'components/hooks/useModal';
import { CreateGroupModal } from 'components/App/modals/CreateGroupModal';

import { StyledLink } from '../SelectGroup.styled';

export const GroupMenu = ({ groups, groupId, onClose }) => {
  const intl = useIntl();
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

  return (
    <Menu
      style={{
        padding: '16px 0',
        maxHeight: '260px',
        overflow: 'auto',
      }}
    >
      {isTablet && (
        <Menu.Item key="create" onClick={onCreate}>
          <StyledLink to="#">
            <PlusOutlined style={{ color: 'rgb(0,0,0)' }} />
            {intl.formatMessage({ id: 'header.createGroup' })}
          </StyledLink>
        </Menu.Item>
      )}
      {sortGroupsByName.map(group => (
        <Menu.Item
          data-cy={`groupItem-${group.groupId}`}
          key={group.groupId}
          style={
            group.groupId === groupId
              ? { backgroundColor: 'rgb(195, 206, 217)' }
              : {}
          }
        >
          <StyledLink to={`${BASE_GROUP_ROUTE}${group.groupId}`}>
            {group.name}
          </StyledLink>
        </Menu.Item>
      ))}
    </Menu>
  );
};
