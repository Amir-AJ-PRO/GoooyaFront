# -------- Base image --------
FROM node:20-slim AS base
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# -------- deps: install dependencies --------
FROM base AS deps

# mirror config for Liara (IR)
RUN npm config set registry https://npm-mirror.liara.ir \
 && npm config set strict-ssl false \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000

COPY package.json package-lock.json ./

# npm ci از فیلد resolved در lockfile می‌خواند؛ URLهای قدیمی (runflare/npmjs) را به لیارا عوض کن
RUN sed -i \
      -e 's|https://mirror-npm.runflare.com|https://npm-mirror.liara.ir|g' \
      -e 's|https://registry.npmjs.org|https://npm-mirror.liara.ir|g' \
      package-lock.json \
 && npm ci --include=dev --no-fund --no-audit

# -------- builder: build Next.js --------
FROM base AS builder

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SUPPORT_API_BASE_URL
ARG API_BASE

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SUPPORT_API_BASE_URL=$NEXT_PUBLIC_SUPPORT_API_BASE_URL
ENV API_BASE=$API_BASE
ENV PATH=/app/node_modules/.bin:$PATH

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# -------- runner: production runtime --------
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8030
ENV HOSTNAME=0.0.0.0

# create non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# copy static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# copy public assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 8030

# healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
 CMD node -e "fetch('http://127.0.0.1:8030/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
