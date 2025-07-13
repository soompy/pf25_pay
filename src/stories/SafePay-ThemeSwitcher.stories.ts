import type { Meta, StoryObj } from '@storybook/react';
import { ThemeSwitcher } from '../components/ui/molecules/ThemeSwitcher';
import { ThemeProvider } from '../contexts/ThemeContext';

const meta: Meta<typeof ThemeSwitcher> = {
  title: 'SafePay/ThemeSwitcher',
  component: ThemeSwitcher,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'SafePay의 테마 전환 컴포넌트입니다. 라이트/다크 모드와 다양한 컬러 테마를 지원합니다.'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['dropdown', 'inline', 'modal'],
      description: '테마 스위처의 표시 방식'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '테마 스위처의 크기'
    },
    showCustomizer: {
      control: 'boolean',
      description: '커스텀 컬러 피커 표시 여부'
    }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Dropdown: Story = {
  args: {
    variant: 'dropdown',
    showCustomizer: false,
  },
};

export const DropdownWithCustomizer: Story = {
  args: {
    variant: 'dropdown',
    showCustomizer: true,
  },
};

export const Inline: Story = {
  args: {
    variant: 'inline',
  },
};

export const Small: Story = {
  args: {
    variant: 'dropdown',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    variant: 'dropdown',
    size: 'lg',
  },
};