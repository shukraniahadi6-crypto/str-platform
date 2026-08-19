import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import LandingPage from './page';

describe('LandingPage', () => {
  it('renders primary heading', () => {
    render(<LandingPage />);
    expect(screen.getByRole('heading', { name: /schedule smarter pickups/i })).toBeDefined();
  });
});
