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
  showBorder = true,
  footerHeight = '64px',
  bgColor = 'transparent',
}) {
  return (
    <StyledContainer bgColor={bgColor}>
      {header && <StyledHeader showBorder={showBorder}>{header}</StyledHeader>}
      <StyledMain>{children}</StyledMain>
      {footer && (
        <StyledFooter showBorder={showBorder} footerHeight={footerHeight}>
          {footer}
        </StyledFooter>
      )}
    </StyledContainer>
  );
}
