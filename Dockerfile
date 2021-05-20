FROM node:14-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/
RUN apk --update add --no-cache curl git python alpine-sdk bash autoconf libtool automake
# prisma bug https://github.com/prisma/prisma/issues/5304
ENV  SKIP_GENERATE=true
RUN YARN_CACHE_FOLDER=/dev/shm/yarn_cache yarn --production
RUN rm -rf /root/.cache/prisma
RUN yarn blitz prisma generate

COPY .next /usr/src/app/.next
COPY .blitz /usr/src/app/.blitz
COPY public /usr/src/app/public

EXPOSE 5000

CMD [ "yarn", "start", "-p", "5000" ]
HEALTHCHECK CMD curl -f http://localhost:5000/ || exit 1;
