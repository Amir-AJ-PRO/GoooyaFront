/** @type {import('next').NextConfig} */
const path = require('path');
const crypto = require('crypto');

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://api.goooya.ir https://c748821.parspack.net;
  connect-src 'self'
    https://api.goooya.ir
    https://shahrgpt.goooya.ir
    https://shahrgpt.com
    http://localhost:8000
    https://localhost:7255
    http://127.0.0.1:7070
    ws:
    wss:;
  font-src 'self' data:;
  frame-ancestors 'self';
`;

const nextConfig = {
  output: 'standalone',

  outputFileTracingRoot: path.join(__dirname),

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.goooya.ir',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'c748821.parspack.net',
        pathname: '/**',
      },
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
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '7070',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.API_BASE ||
      'https://api.goooya.ir',

    NEXT_PUBLIC_SUPPORT_API_BASE_URL:
      process.env.VITE_SUPPORT_API_BASE_URL ||
      process.env.NEXT_PUBLIC_SUPPORT_API_BASE_URL ||
      process.env.NEXT_PUBLIC_SUPPORT_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.API_BASE ||
      'https://api.goooya.ir',
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-toast',
    ],
  },

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,

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
              const hash = crypto.createHash('sha1');
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
                crypto
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
};

module.exports = nextConfig;