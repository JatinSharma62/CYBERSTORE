import { render, screen } from '@testing-library/react';
import App from './App';

test('renders NEON HUB app', () => {
  render(<App />);
  const element = screen.getByText(/INTERFACE OPERATIONAL/i);
  expect(element).toBeInTheDocument();
});
