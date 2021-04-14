import React, { useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import { Logout } from './Logout';
import { Profile } from './Profile';

import { linkStyles, logoutStyles, iconStyles } from './LinkMenu.styled';

export const LinkMenu = () => {
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const menu = (
    <Menu data-cy="dropdownMenu">
      <Menu.Item style={linkStyles}>
        <Profile />
      </Menu.Item>
      <Menu.Item style={logoutStyles}>
        <Logout />
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      placement="bottomRight"
      onVisibleChange={setDropdownVisibility}
    >
      {dropdownVisibility ? (
        <UpOutlined style={iconStyles} />
      ) : (
        <DownOutlined style={iconStyles} data-cy="dropdownMenuTrigger" />
      )}
    </Dropdown>
  );
};
