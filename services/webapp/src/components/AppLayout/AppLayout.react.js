import React from 'react';
import {
  StyledMain,
  StyledFooter,
  StyledHeader,
  StyledContainer,
} from './AppLayout.styled';

export function AppLayout({
  header,
  footer,
  children,
  footerHeight = '64px',
  bgColor = 'transparent',
}) {
  return (
    <StyledContainer bgColor={bgColor}>
      {header && <StyledHeader>{header}</StyledHeader>}
      <StyledMain>{children}</StyledMain>
      {footer && (
        <StyledFooter footerHeight={footerHeight}>{footer}</StyledFooter>
      )}
    </StyledContainer>
  );
}
