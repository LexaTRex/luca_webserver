import React from 'react';
import { useIntl } from 'react-intl';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { FILES } from './DownloadFiles';
import { INTERFACE } from './Interfaces';

import { Wrapper, StyledLink, StyledMenuItem } from './Export.styled';

export const Export = ({ traces, location }) => {
  const intl = useIntl();

  const menu = (
    <Menu>
      <StyledMenuItem>
        <FILES.CSVDownload traces={traces} location={location} />
      </StyledMenuItem>
      <StyledMenuItem>
        <FILES.ExcelDownload traces={traces} location={location} />
      </StyledMenuItem>
      <StyledMenuItem>
        <FILES.SormasDownload traces={traces} location={location} />
      </StyledMenuItem>
      <StyledMenuItem>
        <FILES.OctoWareTNDownload traces={traces} location={location} />
      </StyledMenuItem>
      <StyledMenuItem>
        <INTERFACE.SormasAPI traces={traces} location={location} />
      </StyledMenuItem>
    </Menu>
  );

  if (!traces || traces.length === 0) return null;

  return (
    <Wrapper>
      <Dropdown overlay={menu}>
        <StyledLink
          className="ant-dropdown-link"
          onClick={event => event.preventDefault()}
        >
          {intl.formatMessage({
            id: 'contactPersonTable.download',
          })}
          <DownOutlined style={{ fontSize: 16, marginLeft: 8 }} />
        </StyledLink>
      </Dropdown>
    </Wrapper>
  );
};
