import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Menu, Dropdown } from 'antd';
import Icon from '@ant-design/icons';

import { LICENSES_ROUTE } from 'constants/routes';

import { ReactComponent as MenuActiveSvg } from 'assets/MenuActive.svg';
import { ReactComponent as MenuInactiveSvg } from 'assets/MenuInactive.svg';

const MenuIcon = active => (
  <Icon
    data-cy="linkMenu"
    component={active ? MenuActiveSvg : MenuInactiveSvg}
    style={{ fontSize: 32, marginRight: 24 }}
  />
);

export const LinkMenu = () => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href={LICENSES_ROUTE}>
          {intl.formatMessage({
            id: 'license.license',
          })}
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={intl.formatMessage({
            id: 'header.menu.privacyLink',
          })}
        >
          {intl.formatMessage({
            id: 'header.menu.privacy',
          })}
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      onVisibleChange={() => setIsOpen(!isOpen)}
      overlay={menu}
      placement="bottomCenter"
    >
      {MenuIcon(isOpen)}
    </Dropdown>
  );
};
