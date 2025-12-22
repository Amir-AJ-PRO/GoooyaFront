# Multi-stage build (install + audit fix + build داخل Docker)

FROM node:20-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---- deps: نصب dependency ها + audit fix ----
FROM base AS deps

# اگر نیاز شد بعضی پکیج‌ها روی alpine به libc نیاز دارند
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./

# نصب دقیق بر اساس lockfile (شامل devDependencies برای build)
RUN npm ci --include=dev --no-fund --no-audit

# اجرای npm audit fix (قابل کنترل با build-arg)
ARG NPM_AUDIT_FIX=true
ARG NPM_AUDIT_FIX_FORCE=false
RUN if [ "$NPM_AUDIT_FIX" = "true" ]; then \
      if [ "$NPM_AUDIT_FIX_FORCE" = "true" ]; then \
        npm audit fix --force || true; \
      else \
        npm audit fix || true; \
      fi; \
    fi

# ---- builder: ساخت پروژه ----
FROM base AS builder
ENV NODE_ENV=production

# این‌ها اگر ست شوند، روی build (به خصوص NEXT_PUBLIC_*) اثر می‌گذارند
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SUPPORT_API_BASE_URL
ARG API_BASE
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SUPPORT_API_BASE_URL=${NEXT_PUBLIC_SUPPORT_API_BASE_URL}
ENV API_BASE=${API_BASE}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ---- runner: اجرای production (standalone) ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8030
ENV HOSTNAME=0.0.0.0

# نصب wget برای healthcheck
RUN apk add --no-cache wget

# ایجاد user غیر root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# کپی فایل‌های public
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# کپی standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# کپی static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8030

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8030/ || exit 1

CMD ["node", "server.js"]
