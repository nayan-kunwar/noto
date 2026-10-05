FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml turbo.json .npmrc ./
COPY packages ./packages
COPY apps/api ./apps/api
RUN pnpm install --filter @repo/api --frozen-lockfile
RUN pnpm --filter @repo/shared build && pnpm --filter @repo/api build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "apps/api/dist/server.js"]
