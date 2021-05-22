FROM node:14-slim

ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG GITHUB_WEBHOOK_SECRET
ARG DATABASE_URL
ARG SESSION_SECRET_KEY

ENV GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}
ENV GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
ENV GITHUB_WEBHOOK_SECRET=${GITHUB_WEBHOOK_SECRET}
ENV DATABASE_URL=${DATABASE_URL}
ENV SESSION_SECRET_KEY=${SESSION_SECRET_KEY}
ENV GITHUB_PRIVATE_KEY=${GITHUB_PRIVATE_KEY}

WORKDIR /usr/src/app


RUN apt-get update && apt-get install curl git -y
COPY package.json yarn.lock ./
COPY ./.blitz ./.blitz
ENV SKIP_GENERATE="true"
RUN YARN_CACHE_FOLDER=/dev/shm/yarn_cache yarn --production
#prisma bug https://github.com/prisma/prisma/issues/5304
RUN rm -rf /root/.cache/prisma
COPY ./db/schema.prisma ./db/schema.prisma
COPY blitz.config.js .
RUN yarn blitz prisma generate

EXPOSE 5000

CMD [ "yarn", "start", "-p", "5000" ]
HEALTHCHECK CMD curl -f http://localhost:5000/ || exit 1;
