import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import error from 'assets/error.svg';
import LucaLogo from 'assets/LucaLogo.svg';

import { HEALTH_DEPARTMENT_SUPPORT_PHONE_NUMBER } from 'constants/environment';
import {
  Wrapper,
  HeaderLogo,
  ErrorGraphic,
  ErrorHeadline,
  HeaderWrapper,
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
              {intl.formatMessage(
                { id: 'error.description' },
                { supportPhone: HEALTH_DEPARTMENT_SUPPORT_PHONE_NUMBER }
              )}
            </ErrorDescription>
            <ErrorGraphic src={error} />
          </ContentWrapper>
        </Wrapper>
      );
    }

    return children;
  }
}
export const ErrorWrapper = injectIntl(ErrorWrapperComponent);
