FROM node:20-alpine

RUN npm install -g pnpm

RUN apk add --no-cache dumb-init

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

ENTRYPOINT ["dumb-init", "--"]

CMD ["pnpm", "run", "dev"]