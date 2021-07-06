import React from 'react';
import { screen } from '@testing-library/react';

// eslint-disable-next-line import/no-unresolved
import { render } from 'utils/testing';

import { Header } from './Header.react';

describe('components / App / Header', () => {
  describe('when onlyLogo properties is true', () => {
    it('not render the header without the app part', () => {
      render(<Header onlyLogo />);
      expect(screen.queryByTestId('header-menu-wrapper')).toBeNull();
    });
  });
  describe('when onlyLogo properties is false', () => {
    it('render the header with the app part', () => {
      render(<Header />);
      expect(screen.queryByTestId('header-menu-wrapper')).toBeInTheDocument();
    });
  });
});
