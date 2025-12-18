# استفاده از build شده local
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
COPY --chown=nextjs:nodejs public ./public

# کپی standalone output
COPY --chown=nextjs:nodejs .next/standalone ./

# کپی static files
COPY --chown=nextjs:nodejs .next/static ./.next/static

USER nextjs

EXPOSE 8030

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8030/ || exit 1

CMD ["node", "server.js"]
