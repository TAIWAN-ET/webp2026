import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the project title', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /cs_smoke/i })).toBeInTheDocument();
});
