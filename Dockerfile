# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# کپی فایل‌های package manager و scripts
COPY package.json package-lock.json* ./
COPY scripts/ ./scripts/

# نصب dependencies (postinstall به صورت خودکار اجرا می‌شود)
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# کپی dependencies از stage قبل
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# تنظیم متغیرهای محیطی برای build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build پروژه
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# ایجاد user غیر root برای امنیت
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# کپی فایل‌های مورد نیاز از standalone build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8030

ENV PORT=8030
ENV HOSTNAME="0.0.0.0"

# استفاده از server.js از پوشه standalone
CMD ["node", "server.js"]

