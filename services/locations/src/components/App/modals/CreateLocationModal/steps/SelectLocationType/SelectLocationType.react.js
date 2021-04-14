import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';

import {
  Wrapper,
  Header,
  Description,
  nextButtonStyles,
} from '../../../generalOnboarding/Onboarding.styled';
import {
  RESTAURANT_TYPE,
  ROOM_TYPE,
  BUILDING_TYPE,
  BASE_TYPE,
} from '../../CreateLocationModal.helper';

import { Selection } from './SelectLocationType.styled';

export const SelectLocationType = ({ next, setLocationType }) => {
  const intl = useIntl();

  const select = type => {
    setLocationType(type);
    next();
  };

  const options = [
    {
      type: RESTAURANT_TYPE,
      intlId: 'modal.createGroup.selectType.restaurant',
      style: { ...nextButtonStyles, marginRight: 16, flex: '0 30%' },
    },
    {
      type: ROOM_TYPE,
      intlId: 'modal.createLocation.selectType.room',
      style: { ...nextButtonStyles, marginRight: 16, flex: '0 30%' },
    },
    {
      type: BUILDING_TYPE,
      intlId: 'modal.createLocation.selectType.building',
      style: { ...nextButtonStyles, flex: '0 30%' },
    },
    {
      type: BASE_TYPE,
      intlId: 'modal.createGroup.selectType.base',
      style: { ...nextButtonStyles, marginTop: 16, flex: '0 30%' },
    },
  ];
  return (
    <Wrapper>
      <Header>
        {intl.formatMessage({ id: 'modal.createLoction.selectType.title' })}
      </Header>
      <Description>
        {intl.formatMessage({
          id: 'modal.createLocation.selectType.description',
        })}
      </Description>
      <Selection>
        {options.map(option => (
          <Button
            key={option.type}
            data-cy={option.type}
            onClick={() => select(option.type)}
            style={option.style}
          >
            {intl.formatMessage({
              id: option.intlId,
            })}
          </Button>
        ))}
      </Selection>
    </Wrapper>
  );
};
