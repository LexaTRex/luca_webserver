import { useIntl } from 'react-intl';
import React, { useState } from 'react';
import { Menu, Dropdown, notification, Tooltip } from 'antd';
import Icon, {
  CopyOutlined,
  PhoneOutlined,
  MailOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

import {
  HEALTH_DEPARTMENT_SUPPORT_EMAIL,
  HEALTH_DEPARTMENT_SUPPORT_PHONE_NUMBER,
} from 'constants/environment';
import { FAQ_LINK } from 'constants/links';

import { ReactComponent as HelpCenterActiveSvg } from 'assets/HelpActive.svg';
import { ReactComponent as HelpCenterDefaultSvg } from 'assets/HelpDefault.svg';

import { HelpCenterComp, MenuText, iconStyle } from './HelpCenter.styled';

const HelpCenterIcon = isActive => (
  <Icon
    component={isActive ? HelpCenterActiveSvg : HelpCenterDefaultSvg}
    style={{ fontSize: 32 }}
  />
);

export const HelpCenter = () => {
  const intl = useIntl();
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const onCopy = link => {
    navigator.clipboard.writeText(link);
    notification.success({
      message: intl.formatMessage({ id: 'tooltip.copy' }),
    });
  };
  const copyTooltipTitle = intl.formatMessage({
    id: 'helpCenter.tooltip.copy',
  });

  const menu = (
    <Menu data-cy="dropdownMenu">
      <Menu.ItemGroup
        title={intl.formatMessage({ id: 'profile.services.support' })}
      >
        <Menu.Item onClick={() => onCopy(HEALTH_DEPARTMENT_SUPPORT_EMAIL)}>
          <MailOutlined style={iconStyle} />
          <MenuText>{HEALTH_DEPARTMENT_SUPPORT_EMAIL}</MenuText>
          <Tooltip title={copyTooltipTitle}>
            <CopyOutlined style={{ ...iconStyle, float: 'right' }} />
          </Tooltip>
        </Menu.Item>
        <Menu.Item
          onClick={() => onCopy(HEALTH_DEPARTMENT_SUPPORT_PHONE_NUMBER)}
        >
          <PhoneOutlined style={iconStyle} />
          <MenuText>{HEALTH_DEPARTMENT_SUPPORT_PHONE_NUMBER}</MenuText>
          <Tooltip title={copyTooltipTitle}>
            <CopyOutlined style={{ ...iconStyle, float: 'right' }} />
          </Tooltip>
        </Menu.Item>
      </Menu.ItemGroup>
      <Menu.ItemGroup title={intl.formatMessage({ id: 'general.information' })}>
        <Menu.Item onClick={() => window.open(FAQ_LINK, '_blank')}>
          <QuestionCircleOutlined style={iconStyle} />
          <MenuText>
            {intl.formatMessage({ id: 'profile.services.faq' })}
          </MenuText>
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  return (
    <HelpCenterComp>
      <Dropdown
        overlay={menu}
        placement="bottomRight"
        onVisibleChange={setDropdownVisibility}
      >
        {HelpCenterIcon(dropdownVisibility)}
      </Dropdown>
    </HelpCenterComp>
  );
};
