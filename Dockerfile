FROM node:14-buster
WORKDIR /usr/src/app
RUN apt-get update && apt-get install openssl curl
COPY package.json .
COPY yarn.lock .

RUN yarn install
COPY . .
RUN yarn blitz prisma generate
RUN yarn build
EXPOSE 3000

# If possible, run your container using `docker run --init`
# Otherwise, you can use `tini`:
# RUN apk add --no-cache tini
# ENTRYPOINT ["/sbin/tini", "--"]

CMD ["./node_modules/.bin/blitz","start"]
