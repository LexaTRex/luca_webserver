import React, { useState } from 'react';
import Icon from '@ant-design/icons';
import { useIntl } from 'react-intl';

import { ReactComponent as CreateGroupSvg } from 'assets/CreateGroup.svg';

import { CreateGroupModal } from 'components/App/modals/CreateGroupModal';

import { CreateGroupComp } from './CreateGroup.styled';

const CreateGroupIcon = () => (
  <Icon component={CreateGroupSvg} style={{ fontSize: 32 }} />
);

export const CreateGroup = () => {
  const intl = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCloseModal = () => setIsModalOpen(false);
  const onOpenModal = () => setIsModalOpen(true);

  return (
    <>
      <CreateGroupComp
        title={intl.formatMessage({ id: 'header.createGroup' })}
        data-cy="createGroup"
        onClick={onOpenModal}
      >
        <CreateGroupIcon />
      </CreateGroupComp>
      {isModalOpen && <CreateGroupModal onClose={onCloseModal} />}
    </>
  );
};
