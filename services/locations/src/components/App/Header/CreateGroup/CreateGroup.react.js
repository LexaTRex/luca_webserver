import React from 'react';
import Icon from '@ant-design/icons';

import { ReactComponent as CreateGroupSvg } from 'assets/CreateGroup.svg';

import { useModal } from 'components/hooks/useModal';
import { CreateGroupModal } from 'components/App/modals/CreateGroupModal';

import { CreateGroupComp } from './CreateGroup.styled';

const CreateGroupIcon = () => (
  <Icon component={CreateGroupSvg} style={{ fontSize: 32 }} />
);

export const CreateGroup = () => {
  const [openModal] = useModal();

  const onCreate = () => {
    openModal({
      content: <CreateGroupModal />,
      emphasis: 'noHeader',
    });
  };
  return (
    <CreateGroupComp data-cy="createGroup" onClick={onCreate}>
      <CreateGroupIcon />
    </CreateGroupComp>
  );
};
