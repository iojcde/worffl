FROM node:14-slim
WORKDIR /usr/src/app

RUN apt-get update && apt-get install curl git -y
COPY package.json yarn.lock ./
COPY ./.next ./.next
COPY ./.blitz ./.blitz
ENV SKIP_GENERATE="true"
RUN YARN_CACHE_FOLDER=/dev/shm/yarn_cache yarn --production
#prisma bug https://github.com/prisma/prisma/issues/5304
RUN rm -rf /root/.cache/prisma
COPY ./db/schema.prisma ./db/schema.prisma
RUN yarn blitz prisma generate
RUN yarn build
EXPOSE 5000

CMD [ "yarn", "start", "-p", "5000" ]
HEALTHCHECK CMD curl -f http://localhost:5000/ || exit 1;
