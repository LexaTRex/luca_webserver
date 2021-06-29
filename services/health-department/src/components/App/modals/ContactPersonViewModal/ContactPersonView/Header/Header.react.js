import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { getFormattedDate, getFormattedTime } from 'utils/time';
import { useIntl } from 'react-intl';

import { useModal } from 'components/hooks/useModal';

import {
  CSVDownload,
  ExcelDownload,
  SormasDownload,
} from '../ContactPersonView.helper';
import { DateDisplay, HeaderArea } from '../ContactPersonView.styled';

import { SormasModal } from '../../../SormasModal';

import { LinkStyleButton } from './Header.styled';

export const Header = ({ traces, location }) => {
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

  const openSormasExportModal = () => {
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
    });
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <CSVDownload traces={traces} location={location} />
      </Menu.Item>
      <Menu.Item>
        <SormasDownload traces={traces} location={location} />
      </Menu.Item>
      <Menu.Item>
        <ExcelDownload traces={traces} location={location} />
      </Menu.Item>

      {isSORMASEnabled && (
        <Menu.Item>
          <LinkStyleButton onClick={openSormasExportModal} type="button">
            {intl.formatMessage({ id: 'export.sormas.label' })}
          </LinkStyleButton>
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
