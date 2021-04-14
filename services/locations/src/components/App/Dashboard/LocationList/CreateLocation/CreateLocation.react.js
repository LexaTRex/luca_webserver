import React from 'react';
import { useIntl } from 'react-intl';
import { PlusOutlined } from '@ant-design/icons';

import { useModal } from 'components/hooks/useModal';
import { CreateLocationModal } from 'components/App/modals/CreateLocationModal';

import { Wrapper, CreateText, iconStyle } from './CreateLocation.styled';

export const CreateLocation = ({ groupId }) => {
  const intl = useIntl();
  const [openModal] = useModal();

  const onCreate = () => {
    openModal({
      content: <CreateLocationModal groupId={groupId} />,
      emphasis: 'noHeader',
    });
  };

  return (
    <Wrapper data-cy={`createLocation-${groupId}`} onClick={onCreate}>
      <PlusOutlined style={iconStyle} />
      <CreateText>
        {intl.formatMessage({ id: 'groupList.createLocation' })}
      </CreateText>
    </Wrapper>
  );
};
