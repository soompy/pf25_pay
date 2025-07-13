'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle,
  CreditCard,
  Send,
  Users,
  TrendingUp,
  Shield
} from 'lucide-react';

const demos = [
  {
    id: 'authentication',
    title: '인증 시스템',
    description: '로그인, 회원가입, 2FA 인증 플로우',
    icon: Shield,
    color: 'from-blue-500 to-blue-600',
    features: [
      '이메일/비밀번호 로그인',
      '2단계 인증 (2FA)',
      '비밀번호 재설정',
      '계정 보안 설정'
    ],
    mockScreens: [
      { title: '로그인', description: 'React Hook Form + Zod 검증' },
      { title: '2FA 인증', description: '6자리 OTP 입력' },
      { title: '대시보드', description: '로그인 완료 후 메인 화면' }
    ]
  },
  {
    id: 'payment',
    title: '결제 시스템',
    description: '송금, 결제 요청, 카드 관리 기능',
    icon: CreditCard,
    color: 'from-green-500 to-green-600',
    features: [
      '즉시 송금 및 예약 송금',
      'QR 코드 결제 요청',
      '다중 카드 관리',
      '거래 내역 분석'
    ],
    mockScreens: [
      { title: '송금하기', description: '4단계 송금 플로우' },
      { title: '결제 요청', description: 'QR 코드 생성 및 공유' },
      { title: '카드 관리', description: '시각적 카드 인터페이스' }
    ]
  },
  {
    id: 'dashboard',
    title: '대시보드',
    description: '재무 현황 및 빠른 액션 인터페이스',
    icon: TrendingUp,
    color: 'from-purple-500 to-purple-600',
    features: [
      '실시간 잔액 표시',
      '최근 거래 내역',
      '월별 지출 분석',
      '빠른 액션 버튼'
    ],
    mockScreens: [
      { title: '메인 대시보드', description: '재무 현황 한눈에 보기' },
      { title: '거래 내역', description: '필터링 및 검색 기능' },
      { title: '설정', description: '계정 및 보안 설정' }
    ]
  },
  {
    id: 'responsive',
    title: '반응형 디자인',
    description: '모든 디바이스에서 최적화된 경험',
    icon: Monitor,
    color: 'from-orange-500 to-orange-600',
    features: [
      '모바일 우선 설계',
      '태블릿 최적화',
      '데스크톱 확장',
      '다크모드 지원'
    ],
    mockScreens: [
      { title: '모바일 뷰', description: '터치 친화적 인터페이스' },
      { title: '태블릿 뷰', description: '중간 화면 최적화' },
      { title: '데스크톱 뷰', description: '넓은 화면 활용' }
    ]
  }
];

const techStack = [
  { name: 'Next.js 15', category: 'Framework', description: 'App Router, SSR/SSG' },
  { name: 'TypeScript', category: 'Language', description: '타입 안정성' },
  { name: 'Tailwind CSS', category: 'Styling', description: '유틸리티 우선 CSS' },
  { name: 'Framer Motion', category: 'Animation', description: '부드러운 애니메이션' },
  { name: 'Zustand', category: 'State', description: '경량 상태 관리' },
  { name: 'React Hook Form', category: 'Forms', description: '성능 최적화된 폼' },
  { name: 'Zod', category: 'Validation', description: '런타임 타입 검증' }
];

export default function DemoPage() {
  const router = useRouter();
  const [selectedDemo, setSelectedDemo] = useState(demos[0]);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const handlePrevScreen = () => {
    setCurrentScreen((prev) => 
      prev > 0 ? prev - 1 : selectedDemo.mockScreens.length - 1
    );
  };

  const handleNextScreen = () => {
    setCurrentScreen((prev) => 
      prev < selectedDemo.mockScreens.length - 1 ? prev + 1 : 0
    );
  };

  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-80 h-[600px]';
      case 'tablet':
        return 'w-[600px] h-[800px]';
      default:
        return 'w-full h-[600px]';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  SafePay 데모
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  인터랙티브 기능 시연
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/auth/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              실제 앱 체험
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Demo Categories */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              데모 카테고리
            </h2>
            <div className="space-y-3">
              {demos.map((demo) => {
                const Icon = demo.icon;
                return (
                  <motion.button
                    key={demo.id}
                    onClick={() => {
                      setSelectedDemo(demo);
                      setCurrentScreen(0);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedDemo.id === demo.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700'
                        : 'bg-white dark:bg-gray-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${demo.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {demo.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {demo.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Main Demo Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Demo Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedDemo.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedDemo.description}
                    </p>
                  </div>
                  
                  {/* Viewport Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('desktop')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'desktop'
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                    >
                      <Monitor className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('tablet')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'tablet'
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                    >
                      <Tablet className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('mobile')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'mobile'
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                    >
                      <Smartphone className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Screen Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handlePrevScreen}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <SkipBack className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Play className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={handleNextScreen}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <SkipForward className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {currentScreen + 1} / {selectedDemo.mockScreens.length}
                  </div>
                </div>
              </div>

              {/* Demo Screen */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900">
                <div className="flex justify-center">
                  <motion.div
                    key={`${selectedDemo.id}-${currentScreen}-${viewMode}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`${getViewportClass()} bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg`}
                  >
                    {/* Mock Browser/App Bar */}
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 border-b border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <div className="flex-1 mx-4">
                          <div className="bg-gray-200 dark:bg-gray-600 rounded px-3 py-1 text-xs text-gray-600 dark:text-gray-300">
                            safepay.demo/{selectedDemo.id}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mock Screen Content */}
                    <div className="p-6 h-full">
                      <div className="text-center">
                        <div className={`w-16 h-16 bg-gradient-to-r ${selectedDemo.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                          {(() => {
                            const Icon = selectedDemo.icon;
                            return <Icon className="w-8 h-8 text-white" />;
                          })()}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {selectedDemo.mockScreens[currentScreen].title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          {selectedDemo.mockScreens[currentScreen].description}
                        </p>

                        {/* Mock Interface Elements */}
                        <div className="space-y-4">
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-20 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                              <div className="w-12 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            </div>
                            <div className="w-full h-8 bg-gray-200 dark:bg-gray-600 rounded mb-3"></div>
                            <div className="flex space-x-2">
                              <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-600 rounded"></div>
                              <div className="w-16 h-6 bg-blue-300 dark:bg-blue-600 rounded"></div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                              <div className="w-16 h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                              <div className="w-16 h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Demo Features */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  주요 기능
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedDemo.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Technology Stack */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                기술 스택
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {tech.name}
                      </h4>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                        {tech.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tech.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">
                실제 앱을 체험해보세요
              </h3>
              <p className="text-blue-100 mb-6">
                모든 기능이 동작하는 완전한 SafePay 경험을 확인하세요
              </p>
              <button
                onClick={() => router.push('/auth/login')}
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                앱 체험하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}