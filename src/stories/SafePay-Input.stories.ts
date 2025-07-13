import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../components/ui/atoms/Input';
import { Mail, Search, Eye, EyeOff, User, Lock } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'SafePay/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'SafePay의 재사용 가능한 Input 컴포넌트입니다. 다양한 variant, 아이콘, 그리고 상태를 지원합니다.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Input의 스타일 variant'
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Input의 크기'
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태'
    },
    error: {
      control: 'text',
      description: '에러 메시지'
    },
    helperText: {
      control: 'text',
      description: '도움말 텍스트'
    }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 Input들
export const Default: Story = {
  args: {
    placeholder: '기본 입력 필드',
  },
};

export const WithLabel: Story = {
  args: {
    placeholder: '이메일 주소',
    helperText: '유효한 이메일 주소를 입력하세요',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'user@example.com',
    leftIcon: Mail({ size: 16 }),
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: '검색어를 입력하세요...',
    leftIcon: Search({ size: 16 }),
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '비밀번호',
    leftIcon: Lock({ size: 16 }),
    rightIcon: Eye({ size: 16 }),
  },
};

export const Username: Story = {
  args: {
    placeholder: '사용자명',
    leftIcon: User({ size: 16 }),
  },
};

// 사이즈
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: '작은 입력 필드',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: '큰 입력 필드',
  },
};

// 상태
export const WithError: Story = {
  args: {
    placeholder: '이메일 주소',
    error: '유효한 이메일 주소를 입력하세요',
    variant: 'error',
    leftIcon: Mail({ size: 16 }),
  },
};

export const WithSuccess: Story = {
  args: {
    placeholder: '이메일 주소',
    variant: 'success',
    helperText: '사용 가능한 이메일입니다',
    leftIcon: Mail({ size: 16 }),
  },
};

export const Disabled: Story = {
  args: {
    placeholder: '비활성화된 입력 필드',
    disabled: true,
    leftIcon: User({ size: 16 }),
  },
};

// 결제 관련 입력들
export const Amount: Story = {
  args: {
    type: 'number',
    placeholder: '0.00',
    helperText: '송금할 금액을 입력하세요',
  },
};

export const CardNumber: Story = {
  args: {
    placeholder: '1234 5678 9012 3456',
    helperText: '카드 번호 16자리',
    maxLength: 19,
  },
};

export const SecurityCode: Story = {
  args: {
    type: 'password',
    placeholder: 'CVV',
    helperText: '카드 뒷면 3자리 숫자',
    maxLength: 3,
    size: 'sm',
  },
};