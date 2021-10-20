FROM node:14.15.4-alpine3.12

RUN apk add --no-cache bash

RUN npm install -g @nestjs/cli
RUN npm install -g sequelize-cli
RUN npm install sequelize pg --save

USER node

WORKDIR /home/node/app
