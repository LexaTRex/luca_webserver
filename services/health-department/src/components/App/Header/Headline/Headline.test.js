import React from 'react';
import { screen } from '@testing-library/react';

// eslint-disable-next-line import/no-unresolved
import { render } from 'utils/testing';

import { Headline } from './Headline.react';

describe('components / App / Header / Headline', () => {
  describe('when onlyLogo is true', () => {
    test('renders the luca logo, headline and verification tag', () => {
      render(<Headline onlyLogo />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByText('Gesundheitsamt')).toBeInTheDocument();
      expect(screen.queryByTestId('headline-verification-tag')).toBeNull();
    });
  });
  describe('when onlyLogo is false', () => {
    test('does render the headline and verification tag', () => {
      render(<Headline onlyLogo={false} />);

      expect(screen.getByText('Gesundheitsamt')).toBeInTheDocument();
      expect(
        screen.queryByTestId('headline-verification-tag')
      ).toBeInTheDocument();
    });
  });
});
