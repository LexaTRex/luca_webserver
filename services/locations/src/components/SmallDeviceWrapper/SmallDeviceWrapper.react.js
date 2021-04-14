import React from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import LucaLogo from 'assets/LucaLogo.svg';
import MobileUsage from 'assets/MobileUsage.svg';
import { ACTIVATION_BASE, ACTIVATE_EMAIL_BASE } from 'constants/routes';
import { useMobileSize } from 'components/hooks/media';

import {
  Title,
  Wrapper,
  HeaderLogo,
  Description,
  HeaderWrapper,
  ContentWrapper,
  HeaderSubTitle,
  MobileUsageGraphic,
} from './SmallDeviceWrapper.styled';

export function SmallDeviceWrapper({ children }) {
  const intl = useIntl();
  const isMobile = useMobileSize();

  const location = useLocation();

  const isMobileSupported =
    location.pathname.includes(ACTIVATION_BASE) ||
    location.pathname.includes(ACTIVATE_EMAIL_BASE);

  return (
    <>
      {children}
      {isMobile && !isMobileSupported && (
        <Wrapper>
          <HeaderWrapper>
            <HeaderLogo src={LucaLogo} />
            <HeaderSubTitle>
              {intl.formatMessage({
                id: 'header.subtitle',
              })}
            </HeaderSubTitle>
          </HeaderWrapper>
          <ContentWrapper>
            <Title>
              {intl.formatMessage({
                id: 'mobileWarning.headline',
              })}
            </Title>
            <Description>
              {intl.formatMessage({
                id: 'mobileWarning.description1',
              })}
            </Description>
            <Description>
              {intl.formatMessage({
                id: 'mobileWarning.description2',
              })}
            </Description>
            <MobileUsageGraphic src={MobileUsage} />
          </ContentWrapper>
        </Wrapper>
      )}
    </>
  );
}
