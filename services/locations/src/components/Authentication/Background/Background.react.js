import React from 'react';
import { useIntl } from 'react-intl';

// Assets
import LucaLogoWhite from 'assets/LucaLogoWhite.svg';
import Login1 from 'assets/Login1.jpg';
import Login2 from 'assets/Login2.jpg';
import Login3 from 'assets/Login3.jpg';

import {
  Left,
  HeaderWrapper,
  Logo,
  SubTitle,
  Right1,
  Right2,
  Right3,
} from './Background.styled';

export const Background = ({ isRegistration }) => {
  const intl = useIntl();
  return (
    <>
      <Left style={isRegistration ? { right: 0 } : { right: '50%' }}>
        <HeaderWrapper>
          <Logo src={LucaLogoWhite} />
          <SubTitle>
            {intl.formatMessage({
              id: 'header.subtitle',
            })}
          </SubTitle>
        </HeaderWrapper>
      </Left>
      {!isRegistration && (
        <>
          <Right1 src={Login1} />
          <Right2 src={Login2} />
          <Right3 src={Login3} />
        </>
      )}
    </>
  );
};
