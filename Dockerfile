FROM node:alpine as builder
RUN apk add --update --no-cache libc6-compat curl git python3 alpine-sdk bash autoconf libtool automake
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

# install production dependencies  
RUN yarn install --pure-lockfile --production
# Save production depenencies installed so we can later copy them in the production image
RUN cp -R node_modules /tmp/node_modules
ENV NODE_ENV production
COPY . .
RUN rm -rf /root/.cache/prisma
RUN yarn blitz prisma generate
RUN yarn build


FROM node:slim
WORKDIR /app

COPY --from=builder /app /tmp/app
RUN rsync -a /tmp/app ./ --exclude node_modules
COPY --from=builder /tmp/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.blitz ./.blitz
COPY --from=builder /app/package.json ./
RUN yarn blitz prisma generate
EXPOSE 5000

CMD [ "yarn", "start", "-p", "5000" ]
HEALTHCHECK CMD curl -f http://localhost:5000/ || exit 1;
