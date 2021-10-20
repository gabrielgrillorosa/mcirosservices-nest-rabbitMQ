#!/bin/bash

npm install
npm run build
npm install -g sequelize-cli
npm install sequelize pg --save
sequelize init
sequelize db:create
sequelize db:migrate

npm run start:dev
