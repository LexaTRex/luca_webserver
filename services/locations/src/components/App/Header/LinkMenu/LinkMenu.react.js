import React, { useState } from 'react';
import { Menu, Dropdown } from 'antd';
import Icon from '@ant-design/icons';

import { ReactComponent as MenuDefaultSvg } from 'assets/MenuDefault.svg';
import { ReactComponent as MenuActiveSvg } from 'assets/MenuActive.svg';

import { Logout } from './Logout';
import { Profile } from './Profile';

import { linkStyles, logoutStyles } from './LinkMenu.styled';

const MenuIcon = dropdownVisibility => (
  <Icon
    component={dropdownVisibility ? MenuActiveSvg : MenuDefaultSvg}
    style={{ fontSize: 32 }}
    data-cy="dropdownMenuTrigger"
  />
);

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
      {MenuIcon(dropdownVisibility)}
    </Dropdown>
  );
};
