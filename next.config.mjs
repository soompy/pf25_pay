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
    unoptimized: true, // Vercel에서 자동 최적화
  },
  // 실험적 기능
  experimental: {
    // 터보팩 사용
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};

export default nextConfig;