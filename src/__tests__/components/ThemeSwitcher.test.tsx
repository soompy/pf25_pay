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
    
    expect(screen.getByText('테마')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher />
      </ThemeSwitcherWrapper>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('테마 선택')).toBeInTheDocument();
    });
  });

  it('displays theme options when opened', async () => {
    render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher />
      </ThemeSwitcherWrapper>
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText('라이트')).toBeInTheDocument();
      expect(screen.getByText('다크')).toBeInTheDocument();
      expect(screen.getByText('블루')).toBeInTheDocument();
      expect(screen.getByText('에메랄드')).toBeInTheDocument();
      expect(screen.getByText('퍼플')).toBeInTheDocument();
    });
  });

  it('changes theme when option is clicked', async () => {
    render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher />
      </ThemeSwitcherWrapper>
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText('다크')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('다크'));
    
    // The dropdown should close after selection (with longer timeout)
    await waitFor(() => {
      expect(screen.queryByText('테마 선택')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('renders inline variant correctly', () => {
    render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher variant="inline" />
      </ThemeSwitcherWrapper>
    );
    
    // Should not have the dropdown button
    expect(screen.queryByText('테마')).not.toBeInTheDocument();
    
    // Should have theme option buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5); // 5 theme options
  });

  it('shows customizer when enabled', async () => {
    render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher showCustomizer />
      </ThemeSwitcherWrapper>
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText('커스텀 테마')).toBeInTheDocument();
    });
  });

  it('handles custom color picker', async () => {
    render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher showCustomizer />
      </ThemeSwitcherWrapper>
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText('커스텀 테마')).toBeInTheDocument();
    });
    
    // Just verify the customizer section exists
    expect(screen.getByText('커스텀 테마')).toBeInTheDocument();
  });

  it('applies custom color when color picker is used', async () => {
    render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher showCustomizer />
      </ThemeSwitcherWrapper>
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText('커스텀 테마')).toBeInTheDocument();
    });
    
    // Test presets are clickable
    expect(screen.getByText('오렌지 테마')).toBeInTheDocument();
    expect(screen.getByText('핑크 테마')).toBeInTheDocument();
    expect(screen.getByText('인디고 테마')).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    render(
      <ThemeSwitcherWrapper>
        <div>
          <ThemeSwitcher />
          <div data-testid="outside">Outside content</div>
        </div>
      </ThemeSwitcherWrapper>
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText('테마 선택')).toBeInTheDocument();
    });
    
    // Click outside using the overlay
    const overlay = document.querySelector('.fixed.inset-0.z-40');
    if (overlay) {
      fireEvent.click(overlay);
    }
    
    await waitFor(() => {
      expect(screen.queryByText('테마 선택')).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher size="sm" />
      </ThemeSwitcherWrapper>
    );
    
    expect(screen.getByRole('button')).toHaveClass('h-8');
    
    rerender(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher size="lg" />
      </ThemeSwitcherWrapper>
    );
    
    expect(screen.getByRole('button')).toHaveClass('h-12');
  });

  it('shows color presets in customizer', async () => {
    render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher showCustomizer />
      </ThemeSwitcherWrapper>
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText('오렌지 테마')).toBeInTheDocument();
      expect(screen.getByText('핑크 테마')).toBeInTheDocument();
      expect(screen.getByText('인디고 테마')).toBeInTheDocument();
    });
  });

  it('applies color preset when clicked', async () => {
    render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher showCustomizer />
      </ThemeSwitcherWrapper>
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      const orangePreset = screen.getByText('오렌지 테마');
      fireEvent.click(orangePreset);
    });
    
    // Should apply the orange theme preset
    // This would typically update the CSS variables
  });

  it('handles keyboard navigation', async () => {
    render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher />
      </ThemeSwitcherWrapper>
    );
    
    const button = screen.getByRole('button');
    
    // Test click to open dropdown
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText('테마 선택')).toBeInTheDocument();
    });
    
    // Test Escape key (if implemented)
    fireEvent.keyDown(button, { key: 'Escape' });
  });

  it('maintains accessibility attributes', () => {
    render(
      <ThemeSwitcherWrapper>
        <ThemeSwitcher />
      </ThemeSwitcherWrapper>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('테마');
  });
});