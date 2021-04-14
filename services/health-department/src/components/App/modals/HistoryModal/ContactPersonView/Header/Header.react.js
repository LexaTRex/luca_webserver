import React from 'react';
import { Dropdown, Button, Menu } from 'antd';

import { getFormattedDate, getFormattedTime } from 'utils/time';

import { useIntl } from 'react-intl';
import {
  CSVDownload,
  ExcelDownload,
  SormasDownload,
} from '../ContactPersonView.helper';
import { HeaderArea, DateDisplay } from '../ContactPersonView.styled';

import { SormasModal } from '../../../SormasModal';
import { useModal } from '../../../../../hooks/useModal';

import { StyledSORMASExportButton } from './Header.styled';

const HeaderRaw = ({ traces, location }) => {
  const intl = useIntl();
  const isSORMASEnabled = !!new URLSearchParams(window.location.search).get(
    'sormas'
  );
  const [openModal, closeModal] = useModal();
  const getRequestTime = () =>
    `${getFormattedDate(location.time[0])} ${getFormattedTime(
      location.time[0]
    )} - ${getFormattedDate(location.time[1])} ${getFormattedTime(
      location.time[1]
    )}`;

  const openHistory = () => {
    openModal({
      title: null,
      content: (
        <SormasModal
          closeModal={closeModal}
          traces={traces}
          location={location}
        />
      ),
      closable: true,
      blueModal: true,
    });
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <CSVDownload traces={traces} location={location} />
      </Menu.Item>
      <Menu.Item>
        <ExcelDownload traces={traces} location={location} />
      </Menu.Item>
      <Menu.Item>
        <SormasDownload traces={traces} location={location} />
      </Menu.Item>
      {isSORMASEnabled && (
        <Menu.Item>
          <StyledSORMASExportButton onClick={openHistory} type="button">
            {intl.formatMessage({ id: 'export.sormas.label' })}
          </StyledSORMASExportButton>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <HeaderArea>
      <div>
        <h3>{location.name}</h3>
        <DateDisplay>{getRequestTime()}</DateDisplay>
      </div>
      <div>
        <Dropdown overlay={menu} placement="bottomCenter">
          <Button>Download</Button>
        </Dropdown>
      </div>
    </HeaderArea>
  );
};

export const Header = React.memo(HeaderRaw);
