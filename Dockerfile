FROM node:18-alpine

RUN apk add --no-cache curl && \
    curl -fsSL https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz | tar xzf - -C /usr/local/bin

WORKDIR /app

RUN apk add --no-cache openssl
COPY package*.json ./
COPY prisma ./prisma/
RUN yarn install

COPY . .

RUN echo '#!/bin/sh' > /usr/local/bin/entrypoint.sh && \
    echo 'dockerize -wait tcp://medcof-mysql:3306 -timeout 60s' >> /usr/local/bin/entrypoint.sh && \
    echo 'npx prisma migrate dev --name init' >> /usr/local/bin/entrypoint.sh && \
    echo 'exec "$@"' >> /usr/local/bin/entrypoint.sh && \
    chmod +x /usr/local/bin/entrypoint.sh

RUN yarn build

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["node", "dist/server.js"]