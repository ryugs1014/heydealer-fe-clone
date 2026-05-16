/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true, // 개발 중 오류 감지
  swcMinify: true, // 빌드 최적화
  trailingSlash: false, // URL 끝에 '/' 제거
  compress: true, // Gzip 압축
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: false, //  unoptimized: true - Docker 환경용: next/image 최적화 비활성화
    formats: ['image/webp'], // webp 지원
    domains: [
      'res.cloudinary.com', // Cloudinary
      'drive.google.com', // Google Drive
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'prnd-car-purchase.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**', // 해당 호스트 하위의 모든 이미지 경로 허용
      },
    ],
  },

  sassOptions: {
    includePaths: [path.join(__dirname, 'src')],
  },

  webpack(config) {
    // SVG React 컴포넌트 사용
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;
