import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import error from 'assets/error.svg';
import LucaLogo from 'assets/LucaLogo.svg';
import { TERMS_CONDITIONS_LINK } from 'constants/links';

import {
  Link,
  Wrapper,
  HeaderLogo,
  ErrorGraphic,
  ErrorHeadline,
  HeaderWrapper,
  FooterWrapper,
  ContentWrapper,
  HeaderSubTitle,
  ErrorDescription,
} from './ErrorWrapper.styled';

class ErrorWrapperComponent extends Component {
  constructor(properties) {
    super(properties);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // eslint-disable-next-line no-shadow
  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { intl, children } = this.props;

    if (hasError) {
      return (
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
            <ErrorHeadline>
              {intl.formatMessage({ id: 'error.headline' })}
            </ErrorHeadline>
            <ErrorDescription>
              {intl.formatMessage({ id: 'error.description' })}
            </ErrorDescription>
            <ErrorGraphic src={error} />
          </ContentWrapper>
          <FooterWrapper>
            <Link href={TERMS_CONDITIONS_LINK} target="_blank">
              {intl.formatMessage({
                id: 'authentication.background.legal.agb',
              })}
            </Link>
          </FooterWrapper>
        </Wrapper>
      );
    }

    return children;
  }
}
export const ErrorWrapper = injectIntl(ErrorWrapperComponent);
