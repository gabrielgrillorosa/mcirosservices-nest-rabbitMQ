#!/bin/bash

npm install
npm run build
#sequelize init
sequelize db:create
sequelize db:migrate
sequelise db:seed:all
#npx typeorm migration:run
npm run start:dev
