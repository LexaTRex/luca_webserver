import React from 'react';
import { useIntl } from 'react-intl';
import { PrimaryButton } from 'components/general';

import { useModal } from 'components/hooks/useModal';
import { CreateGroupModal } from 'components/App/modals/CreateGroupModal';

import { ButtonWrapper } from './CreateGroup.styled';

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
    <ButtonWrapper>
      <PrimaryButton onClick={onCreate}>
        {intl.formatMessage({ id: 'groupList.createGroup' })}
      </PrimaryButton>
    </ButtonWrapper>
  );
};
