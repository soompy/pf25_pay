import type { Meta, StoryObj } from '@storybook/react';
// import { fn } from '@storybook/test';
import { Button } from '../components/ui/atoms/Button';
import { Send, Mail, Heart } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'SafePay/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'SafePay의 재사용 가능한 Button 컴포넌트입니다. 다양한 variant, size, 그리고 커스터마이징 옵션을 제공합니다.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'success', 'warning'],
      description: '버튼의 스타일 variant'
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xl', 'icon'],
      description: '버튼의 크기'
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 사용 여부'
    },
    loading: {
      control: 'boolean',
      description: '로딩 상태 표시'
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태'
    },
    theme: {
      control: 'select',
      options: ['default', 'custom'],
      description: '테마 타입'
    }
  },
  args: { onClick: () => {} },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 버튼들
export const Default: Story = {
  args: {
    children: '기본 버튼',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: '삭제하기',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: '취소',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '보조 버튼',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: '고스트 버튼',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: '링크 버튼',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: '완료',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: '주의',
  },
};

// 사이즈 variants
export const Small: Story = {
  args: {
    size: 'sm',
    children: '작은 버튼',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: '큰 버튼',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: '아주 큰 버튼',
  },
};

// 아이콘과 함께
export const WithLeftIcon: Story = {
  args: {
    children: '송금하기',
    leftIcon: Send({ size: 16 }),
  },
};

export const WithRightIcon: Story = {
  args: {
    children: '이메일 보내기',
    rightIcon: Mail({ size: 16 }),
  },
};

export const IconOnly: Story = {
  args: {
    size: 'icon',
    children: Heart({ size: 16 }),
    'aria-label': '좋아요',
  },
};

// 상태
export const Loading: Story = {
  args: {
    loading: true,
    children: '처리 중...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: '비활성화됨',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: '전체 너비 버튼',
  },
  parameters: {
    layout: 'padded',
  },
};

// 커스텀 테마
export const CustomTheme: Story = {
  args: {
    theme: 'custom',
    children: '커스텀 테마 버튼',
    customStyle: {
      '--color-primary-500': '#ff6b6b',
      '--color-primary-600': '#ee5a52',
      '--color-primary-700': '#dc3545',
    } as React.CSSProperties,
  },
};