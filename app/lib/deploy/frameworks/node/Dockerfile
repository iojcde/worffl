FROM debian:latest
WORKDIR /usr/src/app
RUN apt-get update && apt-get install openssl build-essential git python3 curl golang -y
RUN curl -fsSL https://deb.nodesource.com/setup_14.x |  bash
RUN apt-get install -y nodejs
RUN npm i -g yarn
