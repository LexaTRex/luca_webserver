import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import Icon from '@ant-design/icons';

import { ReactComponent as BackSvg } from 'assets/back.svg';

import { TRACKING_ROUTE } from 'constants/routes';

import { Wrapper, Text } from './BackButton.styled';

const BackIcon = () => (
  <Icon
    component={BackSvg}
    style={{ color: 'black', marginRight: 16, fontSize: 16 }}
  />
);

export const BackButton = () => {
  const intl = useIntl();
  const history = useHistory();

  const navigate = () => {
    history.push(TRACKING_ROUTE);
  };
  return (
    <Wrapper onClick={navigate}>
      <BackIcon />
      <Text>{intl.formatMessage({ id: 'proccessDetails.back' })}</Text>
    </Wrapper>
  );
};
