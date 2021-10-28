import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { PlusOutlined } from '@ant-design/icons';

import { CreateLocationModal } from 'components/App/modals/CreateLocationModal';

import { Wrapper, CreateText, iconStyle } from './CreateLocation.styled';

export const CreateLocation = ({ groupId }) => {
  const intl = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCloseModal = () => setIsModalOpen(false);
  const onOpenModal = () => setIsModalOpen(true);

  return (
    <>
      <Wrapper data-cy={`createLocation-${groupId}`} onClick={onOpenModal}>
        <PlusOutlined style={iconStyle} />
        <CreateText>
          {intl.formatMessage({ id: 'groupList.createLocation' })}
        </CreateText>
      </Wrapper>
      {isModalOpen && (
        <CreateLocationModal onClose={onCloseModal} groupId={groupId} />
      )}
    </>
  );
};
