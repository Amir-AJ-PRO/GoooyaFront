/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output configuration for Docker
  output: 'standalone',
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      // Production server
      {
        protocol: 'https',
        hostname: 'api.goooya.ir',
        pathname: '/**',
      },
      // CDN/Storage servers
      {
        protocol: 'https',
        hostname: 'c133408.parspack.net',
        pathname: '/**',
      },
      // Development servers
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '10.188.103.122',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE || 'https://api.goooya.ir',
    // پشتیبانی: مقدار اصلی از .env با کلید VITE_SUPPORT_API_BASE_URL خوانده می‌شود
    // و برای استفاده در Client Component به NEXT_PUBLIC_SUPPORT_API_BASE_URL مپ می‌کنیم
    NEXT_PUBLIC_SUPPORT_API_BASE_URL:
      process.env.VITE_SUPPORT_API_BASE_URL ||
      process.env.NEXT_PUBLIC_SUPPORT_API_BASE_URL ||
      process.env.NEXT_PUBLIC_SUPPORT_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.API_BASE ||
      'https://api.goooya.ir',
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Performance optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // Experimental features
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-toast',
    ],
  },
  
  // Prefetching optimization
  webpack: (config, { dev, isServer }) => {
    // بهینه‌سازی برای production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk برای کتابخانه‌های سنگین
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test(module) {
              return (
                module.size() > 160000 &&
                /node_modules[/\\]/.test(module.identifier())
              );
            },
            name(module) {
              const hash = require('crypto').createHash('sha1');
              hash.update(module.identifier());
              return hash.digest('hex').substring(0, 8);
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
          shared: {
            name(module, chunks) {
              return (
                chunks.map((item) => item.name).join('~') ||
                require('crypto')
                  .createHash('sha1')
                  .update(chunks.reduce((acc, chunk) => acc + chunk.name, ''))
                  .digest('hex')
                  .substring(0, 8)
              );
            },
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
        maxInitialRequests: 25,
        minSize: 20000,
      };
    }
    return config;
  },
}

module.exports = nextConfig

