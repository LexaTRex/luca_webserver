import React from 'react';
import { CheckoutButtonWrapper, StyledButton } from './CheckoutButton.styled';

export const CheckoutButton = ({ disabled, children, onClick }) => {
  return (
    <CheckoutButtonWrapper>
      <StyledButton
        tabIndex="1"
        id="checkout"
        data-cy="checkout"
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </StyledButton>
    </CheckoutButtonWrapper>
  );
};
