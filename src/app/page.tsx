'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  CreditCard, 
  Send, 
  Users, 
  TrendingUp,
  Play,
  Github,
  ExternalLink
} from 'lucide-react';
import { Navigation } from '@/components/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Send,
      title: '즉시 송금',
      description: '친구, 가족, 동료에게 안전하고 빠르게 돈을 보내세요',
      image: '/api/placeholder/400/300',
    },
    {
      icon: CreditCard,
      title: '스마트 카드 관리',
      description: '모든 카드를 한 곳에서 관리하고 실시간으로 잔액을 확인하세요',
      image: '/api/placeholder/400/300',
    },
    {
      icon: Users,
      title: '결제 요청',
      description: 'QR 코드나 링크로 간편하게 결제를 요청하세요',
      image: '/api/placeholder/400/300',
    },
    {
      icon: TrendingUp,
      title: '거래 분석',
      description: '상세한 거래 내역과 분석으로 지출을 관리하세요',
      image: '/api/placeholder/400/300',
    },
  ];

  const stats = [
    { label: '활성 사용자', value: '10M+' },
    { label: '월 거래량', value: '$2.5B' },
    { label: '보안 등급', value: 'A+' },
    { label: '처리 속도', value: '< 3초' },
  ];

  const technologies = [
    'Next.js 15',
    'TypeScript',
    'Tailwind CSS',
    'Framer Motion',
    'Zustand',
    'React Hook Form',
    'Zod Validation',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-teal-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  SafePay
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
                새로운 차원의 디지털 결제 플랫폼
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
                안전하고 빠른 송금, 스마트한 카드 관리, 혁신적인 결제 경험을 제공하는 차세대 핀테크 솔루션입니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center"
              >
                앱 체험하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={() => router.push('/demo')}
                className="w-full sm:w-auto border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center"
              >
                <Play className="w-5 h-5 mr-2" />
                데모 보기
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-8 text-sm text-gray-500 dark:text-gray-400"
            >
              💡 데모 계정: user@example.com / password123
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0] 
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-20 left-10 w-16 h-16 bg-green-200 dark:bg-green-800 rounded-full opacity-60"
          />
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -5, 0] 
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1 
            }}
            className="absolute top-40 right-20 w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full opacity-40"
          />
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              x: [0, 10, 0] 
            }}
            transition={{ 
              duration: 7, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2 
            }}
            className="absolute bottom-20 left-1/4 w-8 h-8 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-50"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              강력한 기능들
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              SafePay가 제공하는 혁신적인 결제 솔루션을 경험해보세요
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature List */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`p-6 rounded-xl cursor-pointer transition-all ${
                      currentFeature === index
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700'
                        : 'bg-white dark:bg-gray-700 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setCurrentFeature(index)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        currentFeature === index
                          ? 'bg-green-100 dark:bg-green-800'
                          : 'bg-gray-100 dark:bg-gray-600'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          currentFeature === index
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-600 dark:text-gray-300'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Feature Preview */}
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white">
                <div className="mb-6">
                  {(() => {
                    const Icon = features[currentFeature].icon;
                    return <Icon className="w-12 h-12 mb-4" />;
                  })()}
                  <h3 className="text-2xl font-bold mb-2">
                    {features[currentFeature].title}
                  </h3>
                  <p className="text-green-100">
                    {features[currentFeature].description}
                  </p>
                </div>
                
                {/* Mock Interface */}
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-16 h-3 bg-white/30 rounded"></div>
                      <div className="w-8 h-3 bg-white/30 rounded"></div>
                    </div>
                    <div className="w-full h-20 bg-white/20 rounded"></div>
                    <div className="flex space-x-2">
                      <div className="flex-1 h-8 bg-white/20 rounded"></div>
                      <div className="w-16 h-8 bg-white/40 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              최신 기술 스택
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              현대적이고 확장 가능한 기술들로 구축된 안정적인 플랫폼
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6"
          >
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-center border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {tech}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              지금 시작해보세요
            </h2>
            <p className="text-xl text-green-100 mb-12 max-w-2xl mx-auto">
              SafePay와 함께 더 스마트하고 안전한 결제 경험을 시작하세요
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full sm:w-auto bg-white text-green-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center"
              >
                무료로 시작하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center"
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub 보기
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">SafePay</h3>
            <p className="text-gray-400 mb-6">
              차세대 디지털 결제 플랫폼
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <ExternalLink className="w-6 h-6" />
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-gray-400 text-sm">
              © 2025 SafePay. 포트폴리오 프로젝트입니다.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
