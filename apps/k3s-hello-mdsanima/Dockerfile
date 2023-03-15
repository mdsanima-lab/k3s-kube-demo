# Copyright © 2023 Marcin Różewski MDSANIMA

# Pull node docker image.
FROM node:18.15.0-alpine AS base

# Install dependencies only when needed.
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies.
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed.
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next.
FROM base AS runner
WORKDIR /app

# Disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Run app inside container.
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
