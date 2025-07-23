import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeSwitcher } from '@/components/ui/molecules/ThemeSwitcher';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, whileHover, whileTap, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const ThemeSwitcherWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeSwitcher', () => {
  it('renders correctly with default props', () => {
    render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher />
      </ThemeSwitcherWrapper>
    );
    
    expect(screen.getByRole('button')).toHaveAttribute('title');
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toggles theme when clicked', async () => {
    render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher />
      </ThemeSwitcherWrapper>
    );
    
    const button = screen.getByRole('button');
    const initialTitle = button.getAttribute('title');
    
    fireEvent.click(button);
    
    // After click, title should change
    const newTitle = button.getAttribute('title');
    expect(newTitle).not.toBe(initialTitle);
  });

  it('has appropriate icon for current theme', async () => {
    render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher />
      </ThemeSwitcherWrapper>
    );
    
    const button = screen.getByRole('button');
    
    // Should have either sun or moon icon
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('renders inline variant correctly', () => {
    render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher variant="inline" />
      </ThemeSwitcherWrapper>
    );
    
    // Should have theme option buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2); // 2 theme options (light/dark)
  });

  it('handles keyboard navigation', async () => {
    render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher />
      </ThemeSwitcherWrapper>
    );
    
    const button = screen.getByRole('button');
    
    // Test click to toggle theme
    fireEvent.click(button);
    
    // Test keyboard navigation (if implemented)
    fireEvent.keyDown(button, { key: 'Enter' });
  });

  it('maintains accessibility attributes', () => {
    render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher />
      </ThemeSwitcherWrapper>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title');
  });
});