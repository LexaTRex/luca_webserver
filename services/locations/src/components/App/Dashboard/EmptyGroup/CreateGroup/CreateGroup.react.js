import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';

import { useModal } from 'components/hooks/useModal';
import { CreateGroupModal } from 'components/App/modals/CreateGroupModal';

import { buttonStyles } from './CreateGroup.styled';

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
    <Button onClick={onCreate} style={buttonStyles}>
      {intl.formatMessage({ id: 'groupList.createGroup' })}
    </Button>
  );
};
