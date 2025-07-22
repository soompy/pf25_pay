'use client';

import { useState, useEffect, useRef } from 'react';
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
  ExternalLink,
  Trophy,
  Sparkles
} from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/atoms/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { CanvasConfetti } from '@/components/ui/molecules/CanvasConfetti';

export default function LandingPage() {
  const router = useRouter();
  const { t } = useTranslation('homepage');
  const [currentFeature, setCurrentFeature] = useState(0);
  const [currentMockup, setCurrentMockup] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMilestone, setShowMilestone] = useState(true);
  const milestoneRef = useRef<HTMLElement | null>(null);

  const features = [
    {
      icon: Send,
      title: t('features.items.fast'),
      description: t('features.items.secure'),
      image: '/api/placeholder/400/300',
    },
    {
      icon: CreditCard,
      title: t('features.items.smart'),
      description: t('features.items.easy'),
      image: '/api/placeholder/400/300',
    },
    {
      icon: Users,
      title: t('features.items.fast'),
      description: t('features.items.secure'),
      image: '/api/placeholder/400/300',
    },
    {
      icon: TrendingUp,
      title: t('features.items.smart'),
      description: t('features.items.easy'),
      image: '/api/placeholder/400/300',
    },
  ];

  const stats = [
    { label: t('stats.activeUsers'), value: '10M+' },
    { label: t('stats.monthlyVolume'), value: '$2.5B' },
    { label: t('stats.securityRating'), value: 'A+' },
    { label: t('stats.processingSpeed'), value: '< 3초' },
  ];

  const mockupImages = [
    { src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=600&fit=crop&auto=format&q=80', alt: 'Mobile Payment Screen' },
    { src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=600&fit=crop&auto=format&q=80', alt: 'Credit Card & Phone' },
    { src: 'https://images.unsplash.com/photo-1605792657660-596af9009ccd?w=300&h=600&fit=crop&auto=format&q=80', alt: 'Digital Wallet Interface' },
    { src: 'https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?w=300&h=600&fit=crop&auto=format&q=80', alt: 'Banking App Dashboard' },
    { src: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=300&h=600&fit=crop&auto=format&q=80', alt: 'QR Code Payment' },
    { src: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=300&h=600&fit=crop&auto=format&q=80', alt: 'Contactless Payment' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  // Mockup images auto-swiper
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMockup((prev) => (prev + 1) % mockupImages.length);
    }, 4000); // 4초로 변경하여 더 여유있게 이미지를 볼 수 있도록
    return () => clearInterval(interval);
  }, [mockupImages.length]);

  // Intersection Observer for confetti effect
  useEffect(() => {
    if (!milestoneRef.current || !showMilestone) return;

    let isIntersecting = false;
    let loopTimeoutId: NodeJS.Timeout | null = null;
    let pauseTimeoutId: NodeJS.Timeout | null = null;

    const startConfettiLoop = () => {
      if (!isIntersecting) return;
      
      setShowConfetti(true);
      loopTimeoutId = setTimeout(() => {
        setShowConfetti(false);
        pauseTimeoutId = setTimeout(() => {
          if (isIntersecting) {
            startConfettiLoop(); // 재귀적으로 루프 계속
          }
        }, 1000); // 1초 쉬고 다시 시작
      }, 3000); // 3초 동안 confetti
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isIntersecting) {
            isIntersecting = true;
            startConfettiLoop();
          } else if (!entry.isIntersecting && isIntersecting) {
            isIntersecting = false;
            setShowConfetti(false);
            // 기존 타이머들 정리
            if (loopTimeoutId) clearTimeout(loopTimeoutId);
            if (pauseTimeoutId) clearTimeout(pauseTimeoutId);
          }
        });
      },
      {
        threshold: 0.3, // 30% 보이면 트리거
      }
    );

    observer.observe(milestoneRef.current);

    return () => {
      observer.disconnect();
      if (loopTimeoutId) clearTimeout(loopTimeoutId);
      if (pauseTimeoutId) clearTimeout(pauseTimeoutId);
      setShowConfetti(false);
    };
  }, [showMilestone]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navigation />

      {/* Canvas Confetti Effect */}
      <CanvasConfetti 
        active={showConfetti} 
        duration={5000}
        particleCount={200}
        containerRef={milestoneRef}
      />

      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-[var(--text-primary)] mb-6">
                <span className="bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-500)] bg-clip-text text-transparent">
                  SafePay
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-4">
                {t('hero.subtitle')}
              </p>
              <p className="text-lg mb-12 max-w-3xl mx-auto">
                {t('hero.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <motion.div 
                className="w-full sm:w-auto"
                whileHover={{ 
                  rotateX: 5, 
                  rotateY: 5, 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Button
                  onClick={() => router.push('/auth/login')}
                  variant="success"
                  size="lg"
                  fullWidth={true}
                  className="sm:w-auto shadow-lg"
                >
                  {t('hero.tryApp')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              <motion.div 
                className="w-full sm:w-auto"
                whileHover={{ 
                  rotateX: 5, 
                  rotateY: 5, 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Button
                  onClick={() => router.push('/auth/register')}
                  variant="outline"
                  size="lg"
                  fullWidth={true}
                  className="sm:w-auto shadow-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {t('hero.viewDemo')}
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-8 text-sm text-gray-300"
            >
              {t('hero.demoAccount')}
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
            className="absolute top-20 left-10 w-16 h-16 bg-[var(--color-primary-200)] dark:bg-[var(--color-primary-800)] rounded-full opacity-60"
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
            className="absolute bottom-20 left-1/4 w-8 h-8 bg-[var(--color-info)]/30 dark:bg-[var(--color-info)]/50 rounded-full opacity-50"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  rotateX: 5, 
                  rotateY: 5, 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center bg-[var(--bg-elevated)] p-6 rounded-xl shadow-lg"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="text-3xl md:text-4xl font-bold text-[var(--color-success)] mb-2">
                  {stat.value}
                </div>
                <div className="text-[var(--text-secondary)] font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
              {t('features.title')}
            </h2>
            <p className="text-xl text-[var(--text-primary)] max-w-3xl mx-auto">
              {t('features.description')}
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
                    whileHover={{ 
                      rotateX: 3, 
                      rotateY: 3, 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`p-6 rounded-xl cursor-pointer transition-all ${
                      currentFeature === index
                        ? 'bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20 border-2 border-[var(--color-primary-200)] dark:border-[var(--color-primary-700)]'
                        : 'bg-[var(--bg-elevated)] border-2 border-transparent hover:border-[var(--border-primary)]'
                    }`}
                    onClick={() => setCurrentFeature(index)}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        currentFeature === index
                          ? 'bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-800)]'
                          : 'bg-[var(--bg-tertiary)]'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          currentFeature === index
                            ? 'text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]'
                            : 'text-[var(--text-secondary)]'
                        }`} />
                      </div>
                      <div>
                        <h3 className={`text-xl font-semibold mb-2 ${
                          currentFeature === index
                            ? 'text-[var(--color-primary-800)] dark:text-[var(--color-primary-100)]'
                            : 'text-[var(--text-primary)]'
                        }`}>
                          {feature.title}
                        </h3>
                        <p className={`${
                          currentFeature === index
                            ? 'text-[var(--color-primary-800)] dark:text-[var(--color-primary-200)]'
                            : 'text-[var(--text-primary)]'
                        }`}>
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
              whileHover={{ 
                rotateX: 5, 
                rotateY: 5, 
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
              transition={{ duration: 0.5 }}
              className="relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] rounded-2xl p-8 text-[var(--text-inverse)] shadow-xl">
                <div className="mb-6">
                  {(() => {
                    const Icon = features[currentFeature].icon;
                    return <Icon className="w-12 h-12 mb-4" />;
                  })()}
                  <h3 className="text-2xl text-[var(--color-secondary)] font-bold mb-2">
                    {features[currentFeature].title}
                  </h3>
                  <p className="text-[var(--color-secondary)]">
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

      {/* Payment Section */}
      <section className="py-20 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <div className="mb-8">
                <span className="text-2xl md:text-3xl font-bold text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] block mb-4">
                  {t('payment.title')}
                </span>
                <p className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
                  {t('payment.heading').split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index === 0 && <br />}
                    </span>
                  ))}
                </p>
              </div>
              <strong className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed block">
                {t('payment.description').split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < 3 && <br />}
                  </span>
                ))}
              </strong>
            </motion.div>

            {/* Right Phone Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <div className="relative">
                {/* Phone Frame */}
                <div className="relative w-72 h-[600px] bg-[var(--text-primary)] rounded-[3rem] p-3 shadow-2xl">
                  <div className="w-full h-full bg-[var(--bg-primary)] rounded-[2.5rem] overflow-hidden relative">
                    {/* Screen Content - Auto Swiper */}
                    <div className="relative w-full h-full">
                      {mockupImages.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ 
                            opacity: currentMockup === index ? 1 : 0,
                            scale: currentMockup === index ? 1 : 0.8
                          }}
                          transition={{ duration: 0.6 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover rounded-[2rem] bg-[var(--bg-secondary)]"
                            onLoad={(e) => {
                              e.currentTarget.classList.add('opacity-100');
                            }}
                            onError={(e) => {
                              e.currentTarget.src = '/api/placeholder/300/600';
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Swiper Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {mockupImages.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            currentMockup === index
                              ? 'bg-[var(--color-success)] w-6'
                              : 'bg-[var(--text-tertiary)]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Phone Details */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[var(--text-tertiary)] rounded-full"></div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-[var(--text-tertiary)] rounded-full"></div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute -top-4 -right-4 w-20 h-20 bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)] rounded-full flex items-center justify-center shadow-lg"
                >
                  <CreditCard className="w-10 h-10 text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -5, 0] 
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-[var(--color-info)]/20 dark:bg-[var(--color-info)]/30 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Send className="w-8 h-8 text-[var(--color-info)]" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      
      {/* Milestone Achievement Banner */}
      {showMilestone && (
        <motion.section
          ref={milestoneRef}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20, 
            delay: 0.5 
          }}
          className=" bg-[var(--bg-primary)] py-24 transition-all duration-500"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="inline-block mb-4"
              >
                <Trophy className="w-12 h-12 text-yellow-500 dark:text-yellow-400 mx-auto" />
              </motion.div>
              
              <motion.h3 
                className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
              >
                {t('milestone.title')}
              </motion.h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {t('milestone.subtitle')}
              </p>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Sparkles className="w-10 h-10 text-purple-500 dark:text-purple-400" />
              </motion.div>

            </div>
          </div>
        </motion.section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-500)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-primary-100)] mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-[var(--color-primary-100)] mb-12 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <motion.div 
                className="w-full sm:w-auto"
                whileHover={{ 
                  rotateX: 5, 
                  rotateY: 5, 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Button
                  onClick={() => router.push('/auth/login')}
                  variant="secondary"
                  size="lg"
                  fullWidth={true}
                  className="sm:w-auto bg-[var(--text-inverse)] text-[var(--color-primary-600)] hover:bg-[var(--bg-secondary)] shadow-lg"
                >
                  {t('cta.startFree')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              <motion.div 
                className="w-full sm:w-auto"
                whileHover={{ 
                  rotateX: 5, 
                  rotateY: 5, 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto border-2 border-[var(--text-inverse)] text-[var(--text-inverse)] hover:bg-white/10 px-8 py-3 rounded-lg font-medium text-base h-12 transition-colors flex items-center justify-center shadow-lg"
                >
                  <Github className="w-5 h-5 mr-2" />
                  {t('cta.viewGithub')}
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--text-primary)] text-[var(--text-inverse)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">SafePay</h3>
            <p className="text-[var(--text-tertiary)] mb-6">
              {t('footer.tagline')}
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-[var(--text-tertiary)] hover:text-[var(--text-inverse)] transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-[var(--text-tertiary)] hover:text-[var(--text-inverse)] transition-colors">
                <ExternalLink className="w-6 h-6" />
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-[var(--border-primary)] text-[var(--text-tertiary)] text-sm">
              {t('footer.copyright')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}