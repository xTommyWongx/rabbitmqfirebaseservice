FROM node:18-alpine
RUN apk update && apk add bash
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g knex
COPY . .
COPY ./wait-for-it.sh /usr/src/app
ENTRYPOINT ["./wait-for-it.sh", "rabbitmq:5672", "-t", "120", "--","npm", "start"]
