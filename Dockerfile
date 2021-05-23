FROM registry.jcde.xyz/sirius/sirius-images/builder:latest

ENV GITHUB_CLIENT_SECRET=willbereplacedlater
ENV GITHUB_CLIENT_ID=willbereplacedlater
ENV GITHUB_WEBHOOK_SECRET=willbereplacedlater
ENV DATABASE_URL=willbereplacedlater
ENV SESSION_SECRET_KEY=willbereplacedlater
ENV GITHUB_PRIVATE_KEY=willbereplacedlater
ENV GITHUB_APP_ID=willbereplacedlater

WORKDIR /usr/src/app

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
