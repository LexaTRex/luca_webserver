import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useModal } from 'components/hooks/useModal';
import { CreateGroupModal } from 'components/App/modals/CreateGroupModal';

import { buttonStyle, iconStyle } from '../SelectGroup/SelectGroup.styled';

export const CreateGroup = () => {
  const intl = useIntl();
  const [openModal] = useModal();

  const onCreate = () => {
    openModal({
      content: <CreateGroupModal />,
      emphasis: 'noHeader',
    });
  };
  return (
    <Button style={buttonStyle} data-cy="createGroup" onClick={onCreate}>
      <PlusOutlined style={iconStyle} />
      {intl.formatMessage({ id: 'header.createGroup' })}
    </Button>
  );
};
