import React from 'react';
import { useIntl } from 'react-intl';
import { PrimaryButton } from 'components/general/Buttons.styled';

import {
  Wrapper,
  Header,
  Description,
} from '../../../generalOnboarding/Onboarding.styled';
import {
  RESTAURANT_TYPE,
  NURSING_HOME_TYPE,
  HOTEL_TYPE,
  BASE_TYPE,
  STORE_TYPE,
} from '../../CreateGroupModal.helper';

import { Selection } from './SelectGroupType.styled';

export const SelectGroupType = ({ next, setGroupType }) => {
  const intl = useIntl();

  const select = type => {
    setGroupType(type);
    next();
  };

  const options = [
    {
      type: RESTAURANT_TYPE,
      intlId: 'modal.createGroup.selectType.restaurant',
      style: { marginRight: 16, flex: '0 30%' },
    },
    {
      type: HOTEL_TYPE,
      intlId: 'modal.createGroup.selectType.hotel',
      style: { marginRight: 16, flex: '0 30%' },
    },
    {
      type: NURSING_HOME_TYPE,
      intlId: 'modal.createGroup.selectType.nursing_home',
      style: { flex: '0 30%' },
    },
    {
      type: STORE_TYPE,
      intlId: 'modal.createGroup.selectType.store',
      style: {
        marginTop: 16,
        marginRight: 16,
        flex: '0 30%',
      },
    },
    {
      type: BASE_TYPE,
      intlId: 'modal.createGroup.selectType.base',
      style: { marginTop: 16, flex: '0 30%' },
    },
  ];
  return (
    <Wrapper>
      <Header>
        {intl.formatMessage({ id: 'modal.createGroup.selectType.title' })}
      </Header>
      <Description>
        {intl.formatMessage({
          id: 'modal.createGroup.selectType.description',
        })}
      </Description>
      <Selection>
        {options.map(option => (
          <PrimaryButton
            data-cy={option.type}
            key={option.type}
            onClick={() => select(option.type)}
            style={option.style}
          >
            {intl.formatMessage({
              id: option.intlId,
            })}
          </PrimaryButton>
        ))}
      </Selection>
    </Wrapper>
  );
};
