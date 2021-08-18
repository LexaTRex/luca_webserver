import React, { useState } from 'react';

import { Menu, Dropdown, notification, Tooltip } from 'antd';
import Icon, {
  CopyOutlined,
  PhoneOutlined,
  MailOutlined,
  QuestionCircleOutlined,
  KeyOutlined,
} from '@ant-design/icons';

import { ReactComponent as HelpCenterDefaultSvg } from 'assets/HelpDefault.svg';
import { ReactComponent as HelpCenterActiveSvg } from 'assets/HelpActive.svg';

import { FAQ_LINK } from 'constants/links';
import { useIntl } from 'react-intl';

import { HelpCenterComp, MenuText, iconStyle } from './HelpCenter.styled';
import { HELPCENTER } from './HelpCenter.helper';

const HelpCenterIcon = isActive => (
  <Icon
    component={isActive ? HelpCenterActiveSvg : HelpCenterDefaultSvg}
    style={{ fontSize: 32 }}
  />
);

export const HelpCenter = ({ supportCode }) => {
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
        <Menu.Item onClick={() => onCopy(HELPCENTER.mail)}>
          <MailOutlined style={iconStyle} />
          <MenuText>{HELPCENTER.mail}</MenuText>
          <Tooltip title={copyTooltipTitle}>
            <CopyOutlined style={{ ...iconStyle, float: 'right' }} />
          </Tooltip>
        </Menu.Item>
        <Menu.Item onClick={() => onCopy(HELPCENTER.phone)}>
          <PhoneOutlined style={iconStyle} />
          <MenuText>{HELPCENTER.phone}</MenuText>
          <Tooltip title={copyTooltipTitle}>
            <CopyOutlined style={{ ...iconStyle, float: 'right' }} />
          </Tooltip>
        </Menu.Item>
        <Menu.Item onClick={() => onCopy(supportCode)}>
          <KeyOutlined style={iconStyle} />
          <Tooltip
            title={intl.formatMessage({
              id: 'helpCenter.tooltip.supportCode',
            })}
          >
            <MenuText>{supportCode}</MenuText>
          </Tooltip>
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
