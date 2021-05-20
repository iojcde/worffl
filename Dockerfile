FROM node:14-slim
WORKDIR /usr/src/app
RUN apt-get update && apt-get install curl git -y
COPY package.json yarn.lock ./
ENV SKIP_GENERATE="true"
RUN YARN_CACHE_FOLDER=/dev/shm/yarn_cache yarn --production
RUN rm -rf /root/.cache/prisma
COPY ./db/schema.prisma ./db/schema.prisma
RUN ls
RUN yarn blitz prisma generate
EXPOSE 5000

CMD [ "yarn", "start", "-p", "5000" ]
HEALTHCHECK CMD curl -f http://localhost:5000/ || exit 1;
