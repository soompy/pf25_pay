'use client';

import { motion } from 'framer-motion';
// No icons needed for this component

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            세이프 페이
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8">
            2025 포트폴리오
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            각 페이지는 독립적으로 동작하면서도 전체적으로 일관된 디자인 시스템을 유지하도록 설계했습니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}