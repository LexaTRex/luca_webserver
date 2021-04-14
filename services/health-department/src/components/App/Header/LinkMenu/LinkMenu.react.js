import React from 'react';
import { useIntl } from 'react-intl';
import { Button, Menu, Dropdown } from 'antd';
import Icon from '@ant-design/icons';

import { LICENSES_ROUTE } from 'constants/routes';

import { ReactComponent as MenuSvg } from 'assets/menu.svg';

const MenuIcon = () => <Icon component={MenuSvg} style={{ color: 'black' }} />;

export const LinkMenu = () => {
  const intl = useIntl();
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
    <Dropdown overlay={menu} placement="bottomCenter">
      <Button
        icon={<MenuIcon />}
        style={{
          marginRight: 24,
          backgroundColor: 'transparent',
          border: '1px solid #b8c0ca',
        }}
      />
    </Dropdown>
  );
};
