/** @type {import('next').NextConfig} */
const path = require('path');
const crypto = require('crypto');

function originFromEnv(raw, fallback) {
  try {
    if (raw && String(raw).trim()) {
      return new URL(String(raw).trim()).origin;
    }
  } catch {
    // ignore invalid URL
  }
  return fallback;
}

function imagePatternFromUrl(raw) {
  try {
    if (!raw || !String(raw).trim()) return null;
    const parsed = new URL(String(raw).trim());
    const pattern = {
      protocol: parsed.protocol.replace(':', ''),
      hostname: parsed.hostname,
      pathname: '/**',
    };
    if (parsed.port) {
      pattern.port = parsed.port;
    }
    return pattern;
  } catch {
    return null;
  }
}

const apiOrigin = originFromEnv(
  process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE,
  'https://api.goooya.ir'
);
const localApiImagePattern = imagePatternFromUrl(
  process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE
);

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: ${apiOrigin} https://api.goooya.ir https://c748821.parspack.net https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://a.tile.openstreetmap.org https://b.tile.openstreetmap.org https://c.tile.openstreetmap.org https://unpkg.com;
  connect-src 'self'
    ${apiOrigin}
    https://api.goooya.ir
    https://shahrgpt.goooya.ir
    https://shahrgpt.com
    http://localhost:8000
    http://localhost:8003
    http://127.0.0.1:8003
    https://localhost:7255
    http://127.0.0.1:7070
    ws:
    wss:;
  media-src 'self' blob: data: ${apiOrigin} https://api.goooya.ir https://c748821.parspack.net http://127.0.0.1:8003 http://localhost:8003;
  font-src 'self' data:;
  frame-src 'self' https:;
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
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=300, must-revalidate',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=300, must-revalidate',
          },
        ],
      },
    ];
  },

  images: {
    // Bypass /_next/image proxy — Docker host often cannot reach ParsPack CDN
    unoptimized: true,
    remotePatterns: [
      ...(localApiImagePattern ? [localApiImagePattern] : []),
      {
        protocol: 'https',
        hostname: 'api.goooya.ir',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8003',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8003',
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

  transpilePackages: ['leaflet', 'react-leaflet'],

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