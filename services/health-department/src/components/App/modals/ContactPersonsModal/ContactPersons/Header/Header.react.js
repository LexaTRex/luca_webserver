import React from 'react';
import { useIntl } from 'react-intl';

import { Wrapper, Name, Area } from './Header.styled';

export const Header = ({ location, indexPersonData }) => {
  const intl = useIntl();

  const getNameInfos = () =>
    indexPersonData !== null && indexPersonData.fn && indexPersonData.ln
      ? `${indexPersonData.fn} ${indexPersonData.ln} / ${location.groupName}`
      : location.groupName;

  return (
    <Wrapper>
      <Name>{getNameInfos()}</Name>
      <Area>
        {location.locationName
          ? location.locationName
          : intl.formatMessage({ id: 'location.defaultName' })}
      </Area>
    </Wrapper>
  );
};
