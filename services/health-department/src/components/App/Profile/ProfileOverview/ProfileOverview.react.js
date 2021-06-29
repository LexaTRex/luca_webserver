import React from 'react';
import { useIntl } from 'react-intl';

// Components
import {
  InformationValue,
  InformationKey,
  ItemsWrapper,
  ItemWrapper,
} from './ProfileOverview.styled';

export const ProfileOverview = ({ me, department }) => {
  const intl = useIntl();

  const profileInformation = [
    {
      key: intl.formatMessage({
        id: 'profile.name',
      }),
      value: department.name,
    },
    {
      key: intl.formatMessage({
        id: 'profile.firstname',
      }),
      value: me.firstName,
    },
    {
      key: intl.formatMessage({
        id: 'profile.lastname',
      }),
      value: me.lastName,
    },
    {
      key: intl.formatMessage({
        id: 'profile.email',
      }),
      value: me.email,
    },
  ];

  return (
    <>
      <ItemsWrapper>
        {profileInformation.map(item => (
          <ItemWrapper key={item.key}>
            <InformationKey>{item.key}</InformationKey>
            <InformationValue>{item.value}</InformationValue>
          </ItemWrapper>
        ))}
      </ItemsWrapper>
    </>
  );
};
