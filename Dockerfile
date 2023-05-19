FROM node:18-alpine AS base
RUN apk add --no-cache aws-cli g++ make py3-pip bash

FROM base AS dev
WORKDIR /root/app
COPY . .

## For poor network connectivity
RUN npm config set cache /root/app/.npm/cache
RUN npm config set loglevel info

RUN npm install -g serverless
RUN npm install

USER root
EXPOSE 5000