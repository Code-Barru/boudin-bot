FROM node:23-slim AS builder

WORKDIR /app
COPY . .
RUN npm ci
RUN npm i -g typescript
RUN npm run build

FROM node:23-slim AS production

WORKDIR /app
COPY ./data/config.json ./data/config.json
COPY ./entrypoint.sh ./entrypoint.sh
COPY ./prisma ./prisma
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk1.0-0 \
    libcups2 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libvulkan1 \
    xdg-utils \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -o chrome.deb \
    && apt-get install -y ./chrome.deb \
    && rm chrome.deb

ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable


RUN chmod +x ./entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]
CMD ["node", "dist/base/index.js"]
