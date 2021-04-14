import React from 'react';
import {
  StyledFooter,
  StyledHeader,
  StyledContainer,
} from './AppLayout.styled';

export function AppLayout({
  header,
  footer,
  children,
  bgColor = 'transparent',
}) {
  return (
    <StyledContainer bgColor={bgColor}>
      {header && <StyledHeader>{header}</StyledHeader>}
      {children}
      {footer && <StyledFooter>{footer}</StyledFooter>}
    </StyledContainer>
  );
}
