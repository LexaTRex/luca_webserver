import React from 'react';
import { useIntl } from 'react-intl';
import UAParser from 'ua-parser-js';

import LucaLogo from 'assets/LucaLogo.svg';
import ErrorBrowser from 'assets/ErrorBrowser.svg';

import {
  Title,
  Wrapper,
  HeaderLogo,
  Description,
  HeaderWrapper,
  ContentWrapper,
  HeaderSubTitle,
  ImageWrapper,
  ErrorGraphic,
} from './UnsupportedBrowserWrapper.styled';

export const UnsupportedBrowserWrapper = ({ children }) => {
  const intl = useIntl();

  const browserIsNotSupported = () => {
    const parser = new UAParser();
    return parser.getBrowser().name === 'IE';
  };

  browserIsNotSupported();

  return (
    <>
      {children}
      {browserIsNotSupported() && (
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
                id: 'browserWarning.headline',
              })}
            </Title>
            <Description>
              {intl.formatMessage({
                id: 'browserWarning.description1',
              })}
            </Description>
            <Description>
              {intl.formatMessage({
                id: 'browserWarning.description2',
              })}
            </Description>
            <ImageWrapper>
              <ErrorGraphic src={ErrorBrowser} />
            </ImageWrapper>
          </ContentWrapper>
        </Wrapper>
      )}
    </>
  );
};
