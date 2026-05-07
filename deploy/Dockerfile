# Node 22 Alpine 기반 multi-stage 빌드
FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@10.33.4 --activate

# MARK: - 의존성 설치
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# MARK: - 빌드
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 빌드 타임 환경변수 (NEXT_PUBLIC_* 는 빌드 시 주입 필요)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Node 힙 한도 명시: dev VM 메모리(8GB) thrashing 방지
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Docker 빌드 시에만 standalone output 활성화
RUN sed -i 's|/\* config options here \*/|output: "standalone",|' next.config.ts

RUN pnpm build

# MARK: - 프로덕션 실행
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
