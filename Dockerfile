FROM registry.jcde.xyz/sirius/sirius-images/builder:latest

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
