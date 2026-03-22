FROM node:20-bookworm-slim AS builder
WORKDIR /app

ENV PYTHON=/usr/bin/python3

RUN sed -i 's@deb.debian.org@mirrors.cloud.tencent.com@g' /etc/apt/sources.list.d/debian.sources \
  && apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && ln -sf /usr/bin/python3 /usr/bin/python \
  && rm -rf /var/lib/apt/lists/*

COPY app/package*.json ./app/
COPY server/package*.json ./server/
RUN npm ci --prefix app && npm ci --prefix server

COPY app ./app
COPY server ./server

RUN npm --prefix app run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/app/dist ./app/dist
COPY --from=builder /app/server ./server

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/health').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"

CMD ["npm", "--prefix", "server", "run", "start"]
