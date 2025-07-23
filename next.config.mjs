/** @type {import('next').NextConfig} */
const nextConfig = {
  // 배포용 설정
  typescript: {
    // 빌드 시 타입 에러 무시 (배포용)
    ignoreBuildErrors: true,
  },
  eslint: {
    // 빌드 시 ESLint 에러 무시 (배포용)
    ignoreDuringBuilds: true,
  },
  // 이미지 최적화 설정
  images: {
    formats: ['image/webp', 'image/avif'], // 현대적 이미지 포맷 지원
    domains: ['images.unsplash.com', 'via.placeholder.com'], // 외부 이미지 도메인
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // 반응형 이미지 크기
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // 작은 이미지 크기
    minimumCacheTTL: 60, // 캐시 유지 시간 (초)
  },
  // 터보팩 설정 (Next.js 15)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;