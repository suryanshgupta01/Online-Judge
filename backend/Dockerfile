FROM node:18-alpine
# WORKDIR /compiler

WORKDIR /api
# install gcc
RUN apk add --update build-base

# install python3
RUN apk add --update python3

# install redis
# RUN apk add --update redis && redis-server && redis-cli

# Install g++
# RUN apk add --update g++
# RUN apk update && apk add --no-cache g++
RUN apt-get update && apt-get install -y gcc build-essential

# Install php
RUN apk update && apk add --no-cache php

# Install Java
RUN apk add --update openjdk11

# Install Rust
RUN apk add --update rust

# Install Ruby
RUN apk add --update ruby

# Install C#
# RUN apk add --update mono

COPY package*.json ./
RUN npm install 
COPY . .

ARG MONGO_URL=""
ARG SUBMISSION_PORT=""

ENV MONGO_URL=${MONGO_URL}
ENV SUBMISSION_PORT=${SUBMISSION_PORT}
ENV MAX_TIMEOUT=${MAX_TIMEOUT}

EXPOSE 4500

CMD ["npm", "run", "dev"];
# CMD ["node", "submissionServer.js"]
